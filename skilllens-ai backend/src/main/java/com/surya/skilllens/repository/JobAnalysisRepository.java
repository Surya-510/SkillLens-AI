package com.surya.skilllens.repository;

import com.surya.skilllens.entity.JobAnalysis;
import com.surya.skilllens.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobAnalysisRepository extends JpaRepository<JobAnalysis, Long> {
    List<JobAnalysis> findByResumeOrderByCreatedAtDesc(Resume resume);
    List<JobAnalysis> findByResume_UserIdOrderByCreatedAtDesc(Long userId);
    Optional<JobAnalysis> findFirstByResumeAndTargetRoleAndJobDescriptionOrderByCreatedAtDesc(
            Resume resume, String targetRole, String jobDescription);
}
