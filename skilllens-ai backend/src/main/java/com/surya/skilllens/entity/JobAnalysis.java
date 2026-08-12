package com.surya.skilllens.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_analyses")
@Data
public class JobAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @Column(name = "target_role")
    private String targetRole;

    @Lob
    @Column(name = "job_description", columnDefinition = "LONGTEXT")
    private String jobDescription;

    @Lob
    @Column(name = "matched_skills", columnDefinition = "LONGTEXT")
    private String matchedSkills;

    @Lob
    @Column(name = "missing_skills", columnDefinition = "LONGTEXT")
    private String missingSkills;

    @Lob
    @Column(name = "recommendation", columnDefinition = "LONGTEXT")
    private String recommendation;

    @Column(name = "ats_score")
    private Integer atsScore;

    @Lob
    @Column(name = "technical_questions", columnDefinition = "LONGTEXT")
    private String technicalQuestions;

    @Lob
    @Column(name = "hr_questions", columnDefinition = "LONGTEXT")
    private String hrQuestions;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}