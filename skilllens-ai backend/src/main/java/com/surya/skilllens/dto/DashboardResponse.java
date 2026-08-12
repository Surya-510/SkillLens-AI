package com.surya.skilllens.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DashboardResponse {

    private String username;

    private boolean resumeUploaded;

    private int atsScore;

    private LocalDateTime lastUploaded;

    private int totalResumes;

    private int aiAnalysed;

    private double averageATSScore;

    private int totalReports;

}