package com.surya.skilllens.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.surya.skilllens.dto.InterviewQuestionResponse;
import com.surya.skilllens.dto.ResumeAnalysisResponse;
import com.surya.skilllens.dto.SkillGapResponse;
import jakarta.annotation.PostConstruct;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class AIResumeService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    @Value("${spring.ai.ollama.chat.options.model}")
    private String model;

    public AIResumeService(
            OllamaChatModel model,
            ObjectMapper objectMapper
    ) {
        this.chatClient = ChatClient.builder(model).build();
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        System.out.println("======== AI MODEL ========");
        System.out.println(model);
    }

    // =========================================================
    // RESUME ANALYSIS
    // =========================================================

    public ResumeAnalysisResponse analyzeResume(
            String resumeText
    ) throws Exception {

        return analyzeResume(
                resumeText,
                "",
                ""
        );
    }

    public ResumeAnalysisResponse analyzeResume(
            String resumeText,
            String targetRole,
            String jobDescription
    ) throws Exception {

        String prompt = """
                You are an expert ATS resume analyzer.

                Analyze the candidate resume carefully based on the target role
                and job description.

                IMPORTANT:
                - Do NOT copy example values.
                - Do NOT return placeholder values such as "string".
                - Do NOT return 0 unless the resume truly deserves an ATS score of 0.
                - Calculate a realistic ATS score from 0 to 100.
                - Extract actual skills from the resume.
                - Identify skills required by the target role/job description
                  that are missing from the resume.
                - Give practical suggestions for improving the resume.
                - Write a real 2-4 sentence summary of the resume.
                - Return ONLY one valid JSON object.
                - Do not use markdown.
                - Do not add any explanation before or after the JSON.

                JSON format:
                {
                  "summary": "<actual resume summary>",
                  "atsScore": <number from 0 to 100>,
                  "skills": ["<actual skill>", "<actual skill>"],
                  "missingSkills": ["<missing skill>", "<missing skill>"],
                  "suggestions": ["<specific suggestion>", "<specific suggestion>"]
                }

                Target role:
                """ + safe(targetRole) + """

                Job description:
                """ + safe(jobDescription) + """

                Resume content:
                """ + limit(resumeText, 12000);

        return readJsonWithRetry(
                prompt,
                ResumeAnalysisResponse.class
        );
    }

    // =========================================================
    // SKILL GAP ANALYSIS
    // =========================================================

// =========================================================
// SKILL GAP ANALYSIS
// =========================================================

    public SkillGapResponse analyzeSkillGap(
            String resumeText,
            String targetRole,
            String jobDescription) throws Exception {

        String prompt = """
        You are a professional career skill-gap analyzer.

        Your job is to compare ONE candidate resume against ONE
        target role and ONE job description.

        IMPORTANT:
        The result MUST depend on the actual resume, target role,
        and job description provided below.

        Do NOT reuse generic skills from previous examples.
        Do NOT assume the candidate is a Java developer.
        Do NOT assume the candidate is applying for the same role
        as another candidate.
        Do NOT copy the example values below.

        =====================================================
        STEP 1 - EXTRACT RESUME SKILLS
        =====================================================

        Identify only technical skills, tools, frameworks,
        databases, programming languages, platforms and relevant
        professional skills that are actually present in the resume.

        Do NOT invent skills.

        =====================================================
        STEP 2 - IDENTIFY REQUIRED SKILLS
        =====================================================

        Identify skills required by:

        1. Target role
        2. Job description

        The job description has higher priority when it contains
        specific requirements.

        =====================================================
        STEP 3 - FIND MISSING SKILLS
        =====================================================

        A skill is missing ONLY when:

        - it is relevant to the target role or job description
        - it is clearly required or strongly expected
        - it is not already demonstrated in the resume

        Do NOT mark a skill as missing if the resume already
        contains the same skill or an obvious equivalent.

        Example:

        Resume:
        "Spring Boot"

        Required:
        "Spring Boot"

        Result:
        Spring Boot MUST NOT appear in missingSkills.

        =====================================================
        STEP 4 - MATCHED SKILLS
        =====================================================

        matchedSkills must contain only skills that:

        - exist in the resume
        - are relevant to the target role/job description

        =====================================================
        STEP 5 - SUGGESTIONS
        =====================================================

        Give practical suggestions based specifically on the
        missing skills.

        =====================================================
        STRICT OUTPUT
        =====================================================

        Return ONLY ONE valid JSON object.

        Do NOT return markdown.
        Do NOT return ```json.
        Do NOT return explanation.
        Do NOT return comments.

        Exact structure:

        {
          "summary": "short candidate skill summary",
          "atsScore": 0,
          "skills": [],
          "matchedSkills": [],
          "missingSkills": [],
          "suggestions": []
        }

        Rules:

        summary:
        - one short sentence

        atsScore:
        - integer from 0 to 100
        - based on actual skill match

        skills:
        - skills actually found in resume
        - maximum 12

        matchedSkills:
        - relevant skills already possessed by candidate
        - maximum 12

        missingSkills:
        - relevant skills required by target role/job description
          but not demonstrated in resume
        - maximum 8

        suggestions:
        - maximum 5
        - each must be one short sentence
        - must be based on actual missing skills

        Do NOT put generic skills into missingSkills.

        =====================================================
        TARGET ROLE
        =====================================================

        """ + safe(targetRole) + """

        =====================================================
        JOB DESCRIPTION
        =====================================================

        """ + safe(jobDescription) + """

        =====================================================
        CANDIDATE RESUME
        =====================================================

        """ + limit(resumeText, 10000);

        return readJsonWithRetry(
                prompt,
                SkillGapResponse.class
        );
    }
    // =========================================================
    // INTERVIEW QUESTIONS
    // =========================================================
    public InterviewQuestionResponse generateInterviewQuestions(
            String resumeText,
            String targetRole,
            String jobDescription
    ) throws Exception {

        /*
         * =====================================================
         * TECHNICAL PROMPT
         * =====================================================
         */

        String technicalPrompt = """
            Generate exactly 10 short technical interview questions
            for the candidate's target role.

            IMPORTANT:
            - Do NOT assume the candidate is a Java Backend Developer.
            - Use the ACTUAL target role.
            - Use the ACTUAL technologies and skills in the resume.
            - Use the job description.
            - Do not invent candidate experience.
            - Do not ask unrelated questions.
            - Return exactly 10 questions.
            - Keep questions short.
            - Keep answerKey practical and short.

            Return ONLY valid JSON.

            Required structure:
            {
              "technicalQuestions": [
                {
                  "question": "short technical question",
                  "answerKey": "short practical answer"
                }
              ]
            }

            Rules:
            - exactly 10 questions
            - answerKey must be 1-2 short sentences
            - no duplicate questions
            - no markdown
            - no explanation outside JSON

            Target role:
            """ + safe(targetRole) + """

            Job description:
            """ + safe(jobDescription) + """

            Candidate resume:
            """ + limit(resumeText, 3500);


        /*
         * =====================================================
         * HR PROMPT
         * =====================================================
         */

        String hrPrompt = """
            Generate exactly 5 short HR interview questions
            for a fresher applying for the target role.

            IMPORTANT:
            - Questions must be HR/behavioral.
            - Do NOT generate technical questions.
            - Use target role and resume context.
            - Do not invent candidate experience.
            - Keep answers practical.
            - Return exactly 5 questions.
            - Do not repeat questions.

            Return ONLY valid JSON.

            Required structure:
            {
              "hrQuestions": [
                {
                  "question": "short HR question",
                  "answerKey": "short practical answer"
                }
              ]
            }

            Rules:
            - exactly 5 questions
            - answerKey must be 1-2 short sentences
            - no markdown
            - no explanation outside JSON

            Target role:
            """ + safe(targetRole) + """

            Job description:
            """ + safe(jobDescription) + """

            Candidate resume:
            """ + limit(resumeText, 2500);


        /*
         * =====================================================
         * PARALLEL AI CALLS
         * =====================================================
         *
         * Previously:
         *
         * Technical AI
         *       ↓
         * HR AI
         *
         * Now:
         *
         * Technical AI ─────┐
         *                    ├── result
         * HR AI ────────────┘
         *
         */

        System.out.println(
                "===== PARALLEL INTERVIEW AI START ====="
        );


        long start =
                System.currentTimeMillis();


        CompletableFuture<String> technicalFuture =
                CompletableFuture.supplyAsync(
                        () -> {

                            System.out.println(
                                    "===== TECHNICAL AI START ====="
                            );

                            long technicalStart =
                                    System.currentTimeMillis();

                            String result =
                                    callValidJsonWithRetry(
                                            technicalPrompt,
                                            "technicalQuestions"
                                    );

                            System.out.println(
                                    "Technical AI time: "
                                            + (
                                            System.currentTimeMillis()
                                                    - technicalStart
                                    )
                                            + " ms"
                            );

                            return result;
                        }
                );


        CompletableFuture<String> hrFuture =
                CompletableFuture.supplyAsync(
                        () -> {

                            System.out.println(
                                    "===== HR AI START ====="
                            );

                            long hrStart =
                                    System.currentTimeMillis();

                            String result =
                                    callValidJsonWithRetry(
                                            hrPrompt,
                                            "hrQuestions"
                                    );

                            System.out.println(
                                    "HR AI time: "
                                            + (
                                            System.currentTimeMillis()
                                                    - hrStart
                                    )
                                            + " ms"
                            );

                            return result;
                        }
                );


        /*
         * Wait for both calls.
         */

        String technicalJson =
                technicalFuture.join();

        String hrJson =
                hrFuture.join();


        System.out.println(
                "Both AI calls completed in: "
                        + (
                        System.currentTimeMillis()
                                - start
                )
                        + " ms"
        );


        /*
         * =====================================================
         * PARSE TECHNICAL
         * =====================================================
         */

        var technicalNode =
                objectMapper
                        .readTree(technicalJson)
                        .get("technicalQuestions");


        /*
         * =====================================================
         * PARSE HR
         * =====================================================
         */

        var hrNode =
                objectMapper
                        .readTree(hrJson)
                        .get("hrQuestions");


        /*
         * =====================================================
         * VALIDATE TECHNICAL
         * =====================================================
         */

        if (technicalNode == null
                || !technicalNode.isArray()
                || technicalNode.size() != 10) {

            throw new RuntimeException(
                    "AI returned incomplete technical questions"
            );
        }


        /*
         * =====================================================
         * VALIDATE HR
         * =====================================================
         */

        if (hrNode == null
                || !hrNode.isArray()
                || hrNode.size() != 5) {

            throw new RuntimeException(
                    "AI returned incomplete HR questions"
            );
        }


        /*
         * =====================================================
         * BUILD RESULT
         * =====================================================
         */

        InterviewQuestionResponse result =
                new InterviewQuestionResponse();


        result.setTechnicalQuestions(
                objectMapper.readValue(
                        technicalNode.toString(),
                        objectMapper.getTypeFactory()
                                .constructCollectionType(
                                        List.class,
                                        com.surya.skilllens.dto.InterviewQA.class
                                )
                )
        );


        result.setHrQuestions(
                objectMapper.readValue(
                        hrNode.toString(),
                        objectMapper.getTypeFactory()
                                .constructCollectionType(
                                        List.class,
                                        com.surya.skilllens.dto.InterviewQA.class
                                )
                )
        );


        System.out.println(
                "===== INTERVIEW RESULT ====="
        );

        System.out.println(
                "Technical Questions: "
                        + result.getTechnicalQuestions().size()
        );

        System.out.println(
                "HR Questions: "
                        + result.getHrQuestions().size()
        );


        return result;
    }
    // =========================================================
    // AI JSON VALIDATION + RETRY
    // =========================================================

    private String callValidJsonWithRetry(
            String prompt,
            String requiredArrayName
    ) {

        // First AI call
        String response = callAI(prompt);

        try {

            String json =
                    cleanJson(response);

            var node =
                    objectMapper
                            .readTree(json)
                            .get(requiredArrayName);

            if (node != null
                    && node.isArray()
                    && !node.isEmpty()) {

                return json;
            }

        } catch (Exception ignored) {

            // Retry below
        }

        // =====================================================
        // RETRY PROMPT
        // =====================================================

        String retryPrompt = prompt + """

                CRITICAL:
                Your previous response was invalid or incomplete.

                Return the COMPLETE JSON object now.

                IMPORTANT:
                - Return ONLY JSON.
                - Do not use markdown.
                - Do not add explanation.
                - Complete every array.
                - Complete every object.
                - Make every answer very short.
                - Return all required questions.
                - Do not stop before the final closing ] and }.
                """;

        String retry =
                callAI(retryPrompt);

        try {

            String json =
                    cleanJson(retry);

            var node =
                    objectMapper
                            .readTree(json)
                            .get(requiredArrayName);

            if (node != null
                    && node.isArray()
                    && !node.isEmpty()) {

                return json;
            }

        } catch (Exception ignored) {

            // Fall through
        }

        throw new RuntimeException(
                "AI returned incomplete "
                        + requiredArrayName
        );
    }

    // =========================================================
    // NORMAL JSON RESPONSE + RETRY
    // =========================================================
    private <T> T readJsonWithRetry(
            String prompt,
            Class<T> type) throws Exception {

        // =====================================================
        // FIRST AI CALL
        // =====================================================

        String response = callAI(prompt);

        try {

            String cleaned = cleanJson(response);

            System.out.println(
                    "===== CLEANED AI JSON ====="
            );

            System.out.println(cleaned);

            return objectMapper.readValue(
                    cleaned,
                    type
            );

        } catch (Exception first) {

            System.out.println(
                    "===== FIRST JSON PARSE FAILED ====="
            );

            System.out.println(
                    "Reason: " + first.getMessage()
            );

            // =================================================
            // GENERIC RETRY
            // =================================================

            String retryPrompt = prompt + """

                CRITICAL RETRY:

                Your previous response could not be parsed as JSON.

                Generate the response again.

                STRICT JSON RULES:

                - Return ONLY ONE JSON object.
                - Start with {
                - End with }
                - Use double quotes.
                - No markdown.
                - No ```json.
                - No explanation.
                - No comments.
                - No trailing commas.
                - All arrays must contain strings only.
                - Do not put unescaped double quotes inside strings.
                - Do not use newline characters inside strings.
                - Return the COMPLETE JSON object.
                """;

            String retry = callAI(retryPrompt);

            try {

                String cleanedRetry =
                        cleanJson(retry);

                System.out.println(
                        "===== RETRY CLEANED AI JSON ====="
                );

                System.out.println(
                        cleanedRetry
                );

                return objectMapper.readValue(
                        cleanedRetry,
                        type
                );

            } catch (Exception second) {

                System.out.println(
                        "===== SECOND JSON PARSE FAILED ====="
                );

                System.out.println(
                        "Retry Reason: "
                                + second.getMessage()
                );

                throw new RuntimeException(
                        "AI returned invalid JSON after retry.",
                        second
                );
            }
        }
    }
    // =========================================================
    // AI CALL
    // =========================================================

    private String callAI(String prompt) {

        String response =
                chatClient
                        .prompt()
                        .user(prompt)
                        .call()
                        .content();

        if (response == null
                || response.isBlank()) {

            throw new RuntimeException(
                    "AI returned an empty response"
            );
        }

        System.out.println(
                "RAW AI RESPONSE:\n"
                        + response
        );

        return response.trim();
    }

    // =========================================================
    // CLEAN JSON
    // =========================================================

    private String cleanJson(String response) {

        if (response == null || response.isBlank()) {
            throw new RuntimeException(
                    "AI returned empty response"
            );
        }

        String s = response
                .trim()
                .replace("```json", "")
                .replace("```JSON", "")
                .replace("```", "")
                .trim();

        int start = s.indexOf('{');
        int end = s.lastIndexOf('}');

        if (start < 0 || end <= start) {

            System.out.println(
                    "INVALID AI RESPONSE:"
            );

            System.out.println(s);

            throw new RuntimeException(
                    "AI did not return a complete JSON object"
            );
        }

        return s.substring(
                start,
                end + 1
        ).trim();
    }

    // =========================================================
    // SAFE STRING
    // =========================================================

    private String safe(String value) {

        return value == null
                ? ""
                : value.trim();
    }

    // =========================================================
    // LIMIT RESUME LENGTH
    // =========================================================

    private String limit(
            String value,
            int max
    ) {

        if (value == null) {
            return "";
        }

        return value.length() <= max
                ? value
                : value.substring(0, max);
    }
}