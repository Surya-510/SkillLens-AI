package com.surya.skilllens.controller;

import com.surya.skilllens.dto.*;
import com.surya.skilllens.entity.Resume;
import com.surya.skilllens.entity.ActivityHistory;
import com.surya.skilllens.entity.User;
import com.surya.skilllens.service.ResumeService;
import com.surya.skilllens.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/resume")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private UserRepository userRepository;


    // =========================================================
    // COMMON LOGGED-IN USER
    // =========================================================

    private User getLoggedInUser(
            Authentication authentication) {

        if (authentication == null) {

            throw new RuntimeException(
                    "User not authenticated"
            );
        }

        String username =
                authentication.getName();

        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }


    // =========================================================
    // UPLOAD RESUME
    // =========================================================

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) throws IOException {

        System.out.println(
                "========== UPLOAD CONTROLLER HIT =========="
        );

        User user =
                getLoggedInUser(authentication);

        Resume savedResume =
                resumeService.uploadResume(
                        file,
                        user
                );

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "id",
                savedResume.getId()
        );

        response.put(
                "message",
                "Resume uploaded successfully"
        );

        response.put(
                "fileName",
                savedResume.getFileName()
        );

        response.put(
                "filePath",
                savedResume.getFilePath()
        );

        response.put(
                "uploadedAt",
                savedResume.getUploadedAt()
        );

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // GET MY LATEST RESUME
    // =========================================================

    @GetMapping("/my")
    public ResumeResponse getMyResume(
            Authentication authentication) {

        User user =
                getLoggedInUser(authentication);

        return resumeService.getResume(user);
    }


    // =========================================================
    // DOWNLOAD ORIGINAL RESUME
    // =========================================================

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadResume(
            @PathVariable Long id,
            Authentication authentication
    ) throws IOException {

        User user =
                getLoggedInUser(authentication);

        return resumeService.downloadResume(
                id,
                user
        );
    }


    // =========================================================
    // PARSE RESUME
    // =========================================================

    @GetMapping("/parse/{id}")
    public ResponseEntity<?> parseResume(
            @PathVariable Long id,
            Authentication authentication
    ) throws IOException {

        User user =
                getLoggedInUser(authentication);

        String text =
                resumeService.parseResume(
                        id,
                        user
                );

        return ResponseEntity.ok(text);
    }


    // =========================================================
    // AI RESUME ANALYSIS
    // =========================================================

    @PostMapping("/analyze/{id}")
    public ResumeAnalysisResponse analyzeResume(
            @PathVariable Long id,
            @RequestBody(required = false) SkillGapRequest request,
            Authentication authentication
    ) throws Exception {

        System.out.println(
                "========== ANALYZE CONTROLLER HIT =========="
        );

        User user =
                getLoggedInUser(authentication);

        return resumeService.analyzeResume(
                id,
                user,
                request == null ? "" : request.getTargetRole(),
                request == null ? "" : request.getJobDescription()
        );
    }


    // =========================================================
    // SKILL GAP ANALYSIS
    // =========================================================

    @PostMapping("/skill-gap/{id}")
    public SkillGapResponse analyzeSkillGap(
            @PathVariable Long id,
            @RequestBody SkillGapRequest request,
            Authentication authentication
    ) throws Exception {

        User user = userRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return resumeService.analyzeSkillGap(
                id,
                request.getTargetRole(),
                request.getJobDescription(),
                user
        );
    }


    // =========================================================
    // ATS SCORE
    // =========================================================

    @GetMapping("/ats/{id}")
    public ATSScoreResponse getATSScore(
            @PathVariable Long id,
            Authentication authentication
    ) throws Exception {

        System.out.println(
                "========== ATS CONTROLLER HIT =========="
        );

        User user =
                getLoggedInUser(authentication);

        ATSScoreResponse response =
                new ATSScoreResponse();

        response.setAtsScore(
                resumeService.calculateATSScore(
                        id,
                        user
                )
        );

        return response;
    }


    // =========================================================
    // INTERVIEW QUESTIONS
    // =========================================================

    @PostMapping("/interview/{id}")
    public InterviewQuestionResponse generateInterviewQuestions(
            @PathVariable Long id,
            @RequestBody SkillGapRequest request,
            Authentication authentication) throws Exception {

        System.out.println(
                "===== INTERVIEW API HIT ====="
        );

        System.out.println(
                "INTERVIEW RESUME ID: " + id
        );

        String username =
                authentication.getName();

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        return resumeService.generateInterviewQuestions(
                id,
                user,
                request.getTargetRole(),
                request.getJobDescription()
        );
    }

    // =========================================================
    // DASHBOARD
    // =========================================================

    @GetMapping("/dashboard")
    public DashboardResponse dashboard(
            Authentication authentication
    ) throws Exception {

        User user =
                getLoggedInUser(authentication);

        return resumeService.getDashboard(
                user
        );
    }


    // =========================================================
    // RESUME HISTORY
    // =========================================================

    @GetMapping("/history")
    public List<ResumeHistoryResponse>
    getResumeHistory(
            Authentication authentication
    ) throws IOException {

        User user =
                getLoggedInUser(authentication);

        return resumeService.getResumeHistory(
                user
        );
    }


    // =========================================================
    // DELETE RESUME
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResume(
            @PathVariable Long id,
            Authentication authentication
    ) {

        System.out.println(
                "========== DELETE CONTROLLER HIT =========="
        );

        User user =
                getLoggedInUser(authentication);

        String message =
                resumeService.deleteResume(
                        id,
                        user
                );

        return ResponseEntity.ok(message);
    }


    // =========================================================
    // DOWNLOAD AI REPORT
    // =========================================================

    @GetMapping("/report/{id}")
    public ResponseEntity<Resource> downloadReport(
            @PathVariable Long id,
            Authentication authentication
    ) throws Exception {

        System.out.println(
                "========== REPORT CONTROLLER HIT =========="
        );

        User user =
                getLoggedInUser(authentication);

        return resumeService.downloadReport(
                id,
                user
        );
    }


    // =========================================================
    // RESUME DETAILS
    // =========================================================

    @GetMapping("/{id}")
    public ResumeDetailsResponse getResumeDetails(
            @PathVariable Long id,
            Authentication authentication
    ) throws Exception {

        System.out.println(
                "========== DETAILS CONTROLLER HIT =========="
        );

        User user =
                getLoggedInUser(authentication);

        return resumeService.getResumeDetails(
                id,
                user
        );
    }


    @GetMapping("/activity")
    public List<ActivityHistory> getActivity(Authentication authentication) {
        User user = getLoggedInUser(authentication);
        return resumeService.getActivityHistory(user);
    }

    @GetMapping("/ats-analysis/{id}")
    public ResponseEntity<ATSScoreResponse> getATSAnalysis(
            @PathVariable Long id,
            Authentication authentication) throws Exception {

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                resumeService.getATSAnalysis(id, user)
        );
    }
}
