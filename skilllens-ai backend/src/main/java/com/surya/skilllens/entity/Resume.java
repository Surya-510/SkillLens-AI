package com.surya.skilllens.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "resumes")
@Data
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt = LocalDateTime.now();

    @Lob
    @Column(name = "parsed_text", columnDefinition = "LONGTEXT")
    private String parsedText;

    @Column(name = "ats_score")
    private Integer atsScore;

    @Lob
    @Column(name = "ai_summary", columnDefinition = "LONGTEXT")
    private String aiSummary;

    @Lob
    @Column(name = "ai_skills", columnDefinition = "LONGTEXT")
    private String aiSkills;

    @Lob
    @Column(name = "ai_missing_skills", columnDefinition = "LONGTEXT")
    private String aiMissingSkills;

    @Lob
    @Column(name = "ai_suggestions", columnDefinition = "LONGTEXT")
    private String aiSuggestions;

    @Column(name = "analysis_role")
    private String analysisRole;

    @Lob
    @Column(name = "analysis_job_description", columnDefinition = "LONGTEXT")
    private String analysisJobDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(
            mappedBy = "resume",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<JobAnalysis> analyses;
}