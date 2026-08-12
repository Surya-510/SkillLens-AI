package com.surya.skilllens.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ResumeResponse {

    private Long id;

    private String fileName;

    private String filePath;

    private LocalDateTime uploadedAt;

}
