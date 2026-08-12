package com.surya.skilllens.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ResumeHistoryResponse {

    private Long id;
    private String fileName;
    private LocalDateTime uploadedAt;

    private int atsScore;

}