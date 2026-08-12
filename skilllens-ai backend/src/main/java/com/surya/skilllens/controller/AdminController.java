package com.surya.skilllens.controller;

import com.surya.skilllens.entity.ActivityHistory;
import com.surya.skilllens.entity.Resume;
import com.surya.skilllens.entity.User;
import com.surya.skilllens.repository.ActivityHistoryRepository;
import com.surya.skilllens.repository.ResumeRepository;
import com.surya.skilllens.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.*;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final ActivityHistoryRepository activityRepository;

    public AdminController(UserRepository userRepository,
                           ResumeRepository resumeRepository,
                           ActivityHistoryRepository activityRepository) {
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.activityRepository = activityRepository;
    }

    @GetMapping("/users")
    public List<Map<String, Object>> users() {
        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : userRepository.findAll()) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", u.getId());
            row.put("username", u.getUsername());
            row.put("role", u.getRole());
            row.put("createdAt", u.getCreatedAt());
            row.put("resumeCount", resumeRepository.countByUser(u));
            result.add(row);
        }
        return result;
    }

    @GetMapping("/activity")
    public List<Map<String, Object>> activity() {
        List<Map<String, Object>> result = new ArrayList<>();
        for (ActivityHistory a : activityRepository.findAllByOrderByCreatedAtDesc()) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", a.getId());
            row.put("username", a.getUser() == null ? "Unknown" : a.getUser().getUsername());
            row.put("resumeId", a.getResume() == null ? null : a.getResume().getId());
            row.put("action", a.getAction());
            row.put("description", a.getDescription());
            row.put("createdAt", a.getCreatedAt());
            result.add(row);
        }
        return result;
    }

    @DeleteMapping("/users/{id}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("message", "The admin account cannot be deleted."));
        }

        List<Resume> resumes = resumeRepository.findByUser(user);
        for (Resume resume : resumes) {
            File f = new File(resume.getFilePath());
            if (f.exists()) {
                f.delete();
            }
        }

        // Activity rows reference the user directly, so remove them
        // before deleting the user. Resume -> JobAnalysis rows are
        // already handled by Resume.orphanRemoval/cascade.
        activityRepository.deleteByUser(user);
        userRepository.delete(user);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}
