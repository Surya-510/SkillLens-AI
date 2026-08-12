package com.surya.skilllens.repository;

import com.surya.skilllens.entity.Resume;
import com.surya.skilllens.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByUser(User user);

    Optional<Resume> findByIdAndUser(Long id, User user);

    long countByUser(User user);

    Optional<Resume> findTopByUserOrderByUploadedAtDesc(User user);
}