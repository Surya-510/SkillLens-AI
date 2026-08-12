package com.surya.skilllens.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ResumeDetailsResponse {

    private Long id;

    private String fileName;

    private LocalDateTime uploadedAt;

    private int atsScore;

    private String summary;

    private List<String> skills;
    private List<String> missingSkills;
    private List<String> suggestions;

}