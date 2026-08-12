package com.surya.skilllens.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.surya.skilllens.dto.*;
import com.surya.skilllens.entity.ActivityHistory;
import com.surya.skilllens.entity.JobAnalysis;
import com.surya.skilllens.entity.Resume;
import com.surya.skilllens.entity.User;
import com.surya.skilllens.repository.ActivityHistoryRepository;
import com.surya.skilllens.repository.JobAnalysisRepository;
import com.surya.skilllens.repository.ResumeRepository;
import jakarta.transaction.Transactional;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final PdfParserService pdfParserService;
    private final AIResumeService aiResumeService;
    private final ATSScoreService atsScoreService;
    private final PDFReportService pdfReportService;
    private final ActivityHistoryRepository activityRepository;
    private final JobAnalysisRepository jobAnalysisRepository;
    private final ObjectMapper objectMapper;

    private final String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";

    public ResumeService(
            ResumeRepository resumeRepository,
            PdfParserService pdfParserService,
            AIResumeService aiResumeService,
            ATSScoreService atsScoreService,
            PDFReportService pdfReportService,
            ActivityHistoryRepository activityRepository,
            JobAnalysisRepository jobAnalysisRepository,
            ObjectMapper objectMapper) {
        this.resumeRepository = resumeRepository;
        this.pdfParserService = pdfParserService;
        this.aiResumeService = aiResumeService;
        this.atsScoreService = atsScoreService;
        this.pdfReportService = pdfReportService;
        this.activityRepository = activityRepository;
        this.jobAnalysisRepository = jobAnalysisRepository;
        this.objectMapper = objectMapper;
    }

    private Resume getUserResume(Long id, User user) {
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        return resumeRepository.findByIdAndUser(id, user).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to access this resume"));
    }

    private String parsedText(Resume resume) throws IOException {
        if (resume.getParsedText() != null && !resume.getParsedText().isBlank()) {
            return resume.getParsedText();
        }
        String text = pdfParserService.extractText(resume.getFilePath());
        resume.setParsedText(text);
        resumeRepository.save(resume);
        return text;
    }

    private void log(User user, Resume resume, String action, String description) {
        ActivityHistory h = new ActivityHistory();
        h.setUser(user);
        h.setResume(resume);
        h.setAction(action);
        h.setDescription(description);
        h.setCreatedAt(LocalDateTime.now());
        activityRepository.save(h);
    }

    public Resume uploadResume(MultipartFile file, User user) throws IOException {
        if (file == null || file.isEmpty() || !"application/pdf".equalsIgnoreCase(file.getContentType())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PDF resumes are allowed");
        }

        File folder = new File(uploadDir);
        if (!folder.exists() && !folder.mkdirs()) {
            throw new IOException("Unable to create upload directory");
        }

        String originalName = Optional.ofNullable(file.getOriginalFilename()).orElse("resume.pdf")
                .replaceAll("[^a-zA-Z0-9._-]", "_");
        String fileName = System.currentTimeMillis() + "_" + originalName;
        File destination = new File(folder, fileName);
        file.transferTo(destination.toPath());

        Resume resume = new Resume();
        resume.setFileName(fileName);
        resume.setFilePath(destination.getAbsolutePath());
        resume.setUploadedAt(LocalDateTime.now());
        resume.setUser(user);

        Resume saved = resumeRepository.save(resume);
        log(user, saved, "UPLOAD", "Uploaded " + originalName);
        return saved;
    }

    public ResumeResponse getResume(User user) {
        Resume resume = resumeRepository.findTopByUserOrderByUploadedAtDesc(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No resume uploaded"));

        ResumeResponse r = new ResumeResponse();
        r.setId(resume.getId());
        r.setFileName(resume.getFileName());
        r.setFilePath(resume.getFilePath());
        r.setUploadedAt(resume.getUploadedAt());
        return r;
    }

    public ResponseEntity<Resource> downloadResume(Long id, User user) throws IOException {
        Resume resume = getUserResume(id, user);
        File file = new File(resume.getFilePath());
        if (!file.exists()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Resume file not found");
        log(user, resume, "DOWNLOAD_RESUME", "Downloaded original resume");
        Resource resource = new UrlResource(file.toURI());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resume.getFileName() + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    public String parseResume(Long id, User user) throws IOException {
        return parsedText(getUserResume(id, user));
    }

    public ResumeAnalysisResponse analyzeResume(Long id, User user) throws Exception {
        return analyzeResume(id, user, "", "");
    }

    public ResumeAnalysisResponse analyzeResume(Long id, User user, String targetRole, String jobDescription) throws Exception {
        Resume resume = getUserResume(id, user);
        String role = targetRole == null ? "" : targetRole.trim();
        String jd = jobDescription == null ? "" : jobDescription.trim();

        if (resume.getAiSummary() != null
                && Objects.equals(resume.getAnalysisRole(), role)
                && Objects.equals(resume.getAnalysisJobDescription(), jd)) {
            ResumeAnalysisResponse cached = new ResumeAnalysisResponse();
            cached.setSummary(resume.getAiSummary());
            cached.setAtsScore(resume.getAtsScore());
            cached.setSkills(objectMapper.readValue(resume.getAiSkills(), List.class));
            cached.setMissingSkills(objectMapper.readValue(resume.getAiMissingSkills(), List.class));
            cached.setSuggestions(objectMapper.readValue(resume.getAiSuggestions(), List.class));
            return cached;
        }

        String text = parsedText(resume);
        ResumeAnalysisResponse result = aiResumeService.analyzeResume(text, role, jd);
        resume.setAtsScore(result.getAtsScore());
        resume.setAiSummary(result.getSummary());
        resume.setAiSkills(objectMapper.writeValueAsString(result.getSkills()));
        resume.setAiMissingSkills(objectMapper.writeValueAsString(result.getMissingSkills()));
        resume.setAiSuggestions(objectMapper.writeValueAsString(result.getSuggestions()));
        resume.setAnalysisRole(role);
        resume.setAnalysisJobDescription(jd);
        resumeRepository.save(resume);
        log(user, resume, "ATS_ANALYSIS", "Generated AI resume/ATS analysis");

        return result;
    }

    public int calculateATSScore(Long id, User user) throws Exception {
        Resume resume = getUserResume(id, user);

        if (resume.getAtsScore() != null) {
            return resume.getAtsScore();
        }

        int score = atsScoreService.calculateScore(parsedText(resume));
        resume.setAtsScore(score);
        resumeRepository.save(resume);

        return score;
    }

    public SkillGapResponse analyzeSkillGap(
            Long id,
            String targetRole,
            String jobDescription,
            User user
    ) throws Exception {

        Resume resume = getUserResume(id, user);

        String role =
                targetRole == null
                        ? ""
                        : targetRole.trim();

        String jd =
                jobDescription == null
                        ? ""
                        : jobDescription.trim();


        System.out.println(
                "===== SKILL GAP ANALYSIS ====="
        );

        System.out.println(
                "User: " + user.getUsername()
        );

        System.out.println(
                "Resume ID: " + resume.getId()
        );

        System.out.println(
                "Target Role: " + role
        );

        System.out.println(
                "Job Description Length: " + jd.length()
        );


        /*
         * Cache is always resume + target role + job description.
         *
         * Therefore:
         *
         * User A != User B
         * Resume A != Resume B
         * Role A != Role B
         * JD A != JD B
         *
         * No cross-user / cross-job cache mixing.
         */

        Optional<JobAnalysis> cached =
                jobAnalysisRepository
                        .findFirstByResumeAndTargetRoleAndJobDescriptionOrderByCreatedAtDesc(
                                resume,
                                role,
                                jd
                        );


        /*
         * =====================================================
         * CACHE HIT
         * =====================================================
         */

        if (cached.isPresent()
                && cached.get().getMatchedSkills() != null) {

            JobAnalysis analysis = cached.get();

            System.out.println(
                    "===== SKILL GAP CACHE HIT ====="
            );

            SkillGapResponse result =
                    new SkillGapResponse();


            /*
             * Old DB column:
             * matched_skills
             *
             * New API field:
             * skills
             */

            result.setSkills(
                    readStringList(
                            analysis.getMatchedSkills()
                    )
            );

            result.setMatchedSkills(
                    readStringList(
                            analysis.getMatchedSkills()
                    )
            );


            result.setMissingSkills(
                    readStringList(
                            analysis.getMissingSkills()
                    )
            );


            /*
             * Old DB column:
             * recommendation
             *
             * New API field:
             * suggestions
             *
             * Existing recommendation was stored as a single
             * string, so expose it as one suggestion.
             */

            String recommendation =
                    analysis.getRecommendation();

            if (recommendation != null
                    && !recommendation.isBlank()) {

                try {

                    result.setSuggestions(
                            objectMapper.readValue(
                                    recommendation,
                                    objectMapper.getTypeFactory()
                                            .constructCollectionType(
                                                    List.class,
                                                    String.class
                                            )
                            )
                    );

                } catch (Exception e) {

                    result.setSuggestions(
                            List.of(recommendation)
                    );
                }

            } else {

                result.setSuggestions(
                        new ArrayList<>()
                );
            }


            return result;
        }


        /*
         * =====================================================
         * CACHE MISS
         * =====================================================
         */

        System.out.println(
                "===== SKILL GAP CACHE MISS ====="
        );


        String resumeText =
                parsedText(resume);


        SkillGapResponse result =
                aiResumeService.analyzeSkillGap(
                        resumeText,
                        role,
                        jd
                );


        /*
         * =====================================================
         * SAFETY NORMALIZATION
         * =====================================================
         */

        if (result.getSkills() == null) {

            result.setSkills(
                    new ArrayList<>()
            );
        }

        if (result.getMissingSkills() == null) {

            result.setMissingSkills(
                    new ArrayList<>()
            );
        }

        if (result.getSuggestions() == null) {

            result.setSuggestions(
                    new ArrayList<>()
            );
        }


        /*
         * =====================================================
         * SAVE CACHE
         * =====================================================
         */

        JobAnalysis analysis =
                new JobAnalysis();

        analysis.setResume(resume);

        analysis.setTargetRole(role);

        analysis.setJobDescription(jd);


        /*
         * Store new skills inside existing DB column.
         */

        analysis.setMatchedSkills(
                objectMapper.writeValueAsString(
                        result.getSkills()
                )
        );


        analysis.setMissingSkills(
                objectMapper.writeValueAsString(
                        result.getMissingSkills()
                )
        );


        /*
         * Existing DB has only one recommendation field.
         *
         * Store suggestions as a single JSON array string
         * so multiple suggestions are preserved.
         */

        analysis.setRecommendation(
                objectMapper.writeValueAsString(
                        result.getSuggestions()
                )
        );


        analysis.setCreatedAt(
                LocalDateTime.now()
        );


        jobAnalysisRepository.save(
                analysis
        );


        log(
                user,
                resume,
                "SKILL_GAP",
                "Generated skill gap for " + role
        );


        System.out.println(
                "===== SKILL GAP ANALYSIS COMPLETE ====="
        );


        return result;
    }


/* =========================================================
   READ STRING LIST
========================================================= */

    private List<String> readStringList(
            String value
    ) throws Exception {

        if (value == null
                || value.isBlank()) {

            return new ArrayList<>();
        }

        /*
         * New cache format:
         *
         * ["Java","Spring Boot","SQL"]
         *
         * Old cache could contain:
         *
         * ["Java","Spring Boot"]
         *
         * Both are handled.
         */

        try {

            return objectMapper.readValue(
                    value,
                    objectMapper.getTypeFactory()
                            .constructCollectionType(
                                    List.class,
                                    String.class
                            )
            );

        } catch (Exception ignored) {

            /*
             * Backward compatibility for an old single
             * recommendation string.
             */

            return List.of(value);
        }
    }

    public InterviewQuestionResponse generateInterviewQuestions(
            Long id,
            User user,
            String targetRole,
            String jobDescription) throws Exception {

        long start = System.currentTimeMillis();

        Resume resume = getUserResume(id, user);

        System.out.println("===== INTERVIEW STEP 1 =====");
        System.out.println("Resume loaded in: "
                + (System.currentTimeMillis() - start) + " ms");


        String role = targetRole == null ? "" : targetRole.trim();
        String jd = jobDescription == null ? "" : jobDescription.trim();


        Optional<JobAnalysis> cached =
                jobAnalysisRepository
                        .findFirstByResumeAndTargetRoleAndJobDescriptionOrderByCreatedAtDesc(
                                resume,
                                role,
                                jd
                        );

        System.out.println("===== INTERVIEW STEP 2 =====");
        System.out.println("Cache check completed in: "
                + (System.currentTimeMillis() - start) + " ms");


        if (cached.isPresent()
                && isCompleteInterviewCache(cached.get())) {

            System.out.println("===== INTERVIEW CACHE HIT =====");

            InterviewQuestionResponse result =
                    new InterviewQuestionResponse();

            result.setTechnicalQuestions(
                    objectMapper.readValue(
                            cached.get().getTechnicalQuestions(),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(
                                            List.class,
                                            InterviewQA.class
                                    )
                    )
            );

            result.setHrQuestions(
                    objectMapper.readValue(
                            cached.get().getHrQuestions(),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(
                                            List.class,
                                            InterviewQA.class
                                    )
                    )
            );

            System.out.println("Returning cached result in: "
                    + (System.currentTimeMillis() - start) + " ms");

            return result;
        }


        System.out.println("===== INTERVIEW CACHE MISS =====");

        long parseStart = System.currentTimeMillis();

        String text = parsedText(resume);

        System.out.println(
                "Resume parsed in: "
                        + (System.currentTimeMillis() - parseStart)
                        + " ms"
        );


        System.out.println("===== AI INTERVIEW CALL START =====");

        long aiStart = System.currentTimeMillis();

        InterviewQuestionResponse result =
                aiResumeService.generateInterviewQuestions(
                        text,
                        role,
                        jd
                );

        System.out.println(
                "===== AI INTERVIEW CALL END ====="
        );

        System.out.println(
                "AI took: "
                        + (System.currentTimeMillis() - aiStart)
                        + " ms"
        );


        System.out.println(
                "Total before DB save: "
                        + (System.currentTimeMillis() - start)
                        + " ms"
        );


        JobAnalysis analysis =
                cached.orElseGet(JobAnalysis::new);

        analysis.setResume(resume);
        analysis.setTargetRole(role);
        analysis.setJobDescription(jd);

        analysis.setTechnicalQuestions(
                objectMapper.writeValueAsString(
                        result.getTechnicalQuestions()
                )
        );

        analysis.setHrQuestions(
                objectMapper.writeValueAsString(
                        result.getHrQuestions()
                )
        );

        analysis.setCreatedAt(LocalDateTime.now());

        jobAnalysisRepository.save(analysis);

        log(
                user,
                resume,
                "INTERVIEW",
                "Generated interview questions for " + role
        );

        System.out.println(
                "===== INTERVIEW TOTAL TIME ===== "
                        + (System.currentTimeMillis() - start)
                        + " ms"
        );

        return result;
    }
    private boolean isCompleteInterviewCache(JobAnalysis analysis) {
        try {
            if (analysis == null
                    || analysis.getTechnicalQuestions() == null
                    || analysis.getHrQuestions() == null) {
                return false;
            }

            var technical = objectMapper.readTree(
                    analysis.getTechnicalQuestions()
            );

            var hr = objectMapper.readTree(
                    analysis.getHrQuestions()
            );

            return technical != null
                    && technical.isArray()
                    && technical.size() == 10
                    && hr != null
                    && hr.isArray()
                    && hr.size() == 5;

        } catch (Exception e) {
            // Corrupt/old cache should be regenerated, not returned.
            return false;
        }
    }

    public DashboardResponse getDashboard(User user) {
        DashboardResponse response = new DashboardResponse();
        response.setUsername(user.getUsername());
        List<Resume> resumes = resumeRepository.findByUser(user);
        response.setTotalResumes(resumes.size());
        if (resumes.isEmpty()) {
            response.setResumeUploaded(false);
            response.setAverageATSScore(0);
            response.setAiAnalysed(0);
            response.setTotalReports(0);
            return response;
        }
        resumes.sort(Comparator.comparing(Resume::getUploadedAt));
        Resume latest = resumes.get(resumes.size() - 1);
        response.setResumeUploaded(true);
        response.setLastUploaded(latest.getUploadedAt());
        int totalScore = resumes.stream().map(Resume::getAtsScore).filter(Objects::nonNull).mapToInt(Integer::intValue).sum();
        long scored = resumes.stream().filter(r -> r.getAtsScore() != null).count();
        response.setAverageATSScore(scored == 0 ? 0 : totalScore / (int) scored);
        response.setAiAnalysed((int) activityRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .filter(a -> "ATS_ANALYSIS".equals(a.getAction())).count());
        response.setTotalReports((int) activityRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .filter(a -> "DOWNLOAD_REPORT".equals(a.getAction())).count());
        return response;
    }

    public List<ResumeHistoryResponse> getResumeHistory(User user) {
        List<Resume> resumes = resumeRepository.findByUser(user);
        resumes.sort(Comparator.comparing(Resume::getUploadedAt).reversed());
        List<ResumeHistoryResponse> result = new ArrayList<>();
        for (Resume resume : resumes) {
            ResumeHistoryResponse r = new ResumeHistoryResponse();
            r.setId(resume.getId());
            r.setFileName(resume.getFileName());
            r.setUploadedAt(resume.getUploadedAt());
            r.setAtsScore(resume.getAtsScore() == null ? 0 : resume.getAtsScore());
            result.add(r);
        }
        return result;
    }

    @Transactional
    public String deleteResume(Long id, User user) {
        Resume resume = getUserResume(id, user);
        List<ActivityHistory> activities = activityRepository.findByResume(resume);
        activities.forEach(a -> a.setResume(null));
        activityRepository.saveAll(activities);

        String deletedName = resume.getFileName();
        File file = new File(resume.getFilePath());
        if (file.exists()) file.delete();

        resumeRepository.delete(resume);

        ActivityHistory deleteLog = new ActivityHistory();
        deleteLog.setUser(user);
        deleteLog.setResume(null);
        deleteLog.setAction("DELETE_RESUME");
        deleteLog.setDescription("Deleted " + deletedName);
        deleteLog.setCreatedAt(LocalDateTime.now());
        activityRepository.save(deleteLog);
        return "Resume deleted successfully";
    }

    public ResponseEntity<Resource> downloadReport(Long id, User user) throws Exception {
        Resume resume = getUserResume(id, user);
        ResumeAnalysisResponse analysis;
        if (resume.getAiSummary() != null) {
            analysis = new ResumeAnalysisResponse();
            analysis.setSummary(resume.getAiSummary());
            analysis.setAtsScore(resume.getAtsScore());
            analysis.setSkills(objectMapper.readValue(resume.getAiSkills(), List.class));
            analysis.setMissingSkills(objectMapper.readValue(resume.getAiMissingSkills(), List.class));
            analysis.setSuggestions(objectMapper.readValue(resume.getAiSuggestions(), List.class));
        } else {
            analysis = aiResumeService.analyzeResume(parsedText(resume));
        }
        byte[] pdf = pdfReportService.generateReport(resume, analysis);
        log(user, resume, "DOWNLOAD_REPORT", "Downloaded AI report");
        ByteArrayResource resource = new ByteArrayResource(pdf);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"SkillLens_Report.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(pdf.length)
                .body(resource);
    }
    public ResumeDetailsResponse getResumeDetails(Long id, User user) throws Exception {

        Resume resume = getUserResume(id, user);

        ResumeDetailsResponse response = new ResumeDetailsResponse();

        response.setId(resume.getId());
        response.setFileName(resume.getFileName());
        response.setUploadedAt(resume.getUploadedAt());

        // Already stored AI analysis
        if (resume.getAiSummary() != null) {

            response.setSummary(resume.getAiSummary());

            response.setAtsScore(
                    resume.getAtsScore() == null
                            ? 0
                            : resume.getAtsScore()
            );

            response.setSkills(
                    resume.getAiSkills() != null
                            ? objectMapper.readValue(
                            resume.getAiSkills(),
                            List.class
                    )
                            : List.of()
            );

            response.setMissingSkills(
                    resume.getAiMissingSkills() != null
                            ? objectMapper.readValue(
                            resume.getAiMissingSkills(),
                            List.class
                    )
                            : List.of()
            );

            response.setSuggestions(
                    resume.getAiSuggestions() != null
                            ? objectMapper.readValue(
                            resume.getAiSuggestions(),
                            List.class
                    )
                            : List.of()
            );

        } else {

            // Don't run AI automatically here
            response.setSummary("Resume has not been analyzed yet.");
            response.setAtsScore(
                    resume.getAtsScore() == null
                            ? 0
                            : resume.getAtsScore()
            );
            response.setSkills(List.of());
            response.setMissingSkills(List.of());
            response.setSuggestions(List.of());
        }

        return response;
    }

    public List<ActivityHistory> getActivityHistory(User user) {
        return activityRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<ActivityHistory> getAllActivityHistory() {
        return activityRepository.findAllByOrderByCreatedAtDesc();
    }

    public ATSScoreResponse getATSAnalysis(Long id, User user) throws Exception {

        Resume resume = getUserResume(id, user);

        String text = parsedText(resume);

        int score = resume.getAtsScore() != null
                ? resume.getAtsScore()
                : atsScoreService.calculateScore(text);

        ATSScoreResponse response = new ATSScoreResponse();

        response.setAtsScore(score);

        return response;
    }
}
