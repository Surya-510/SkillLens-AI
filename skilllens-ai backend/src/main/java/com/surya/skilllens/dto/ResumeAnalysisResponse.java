package com.surya.skilllens.dto;

import lombok.Data;
import java.util.List;

@Data
public class ResumeAnalysisResponse {

    private String summary;

    private int atsScore;

    private List<String> skills;

    private List<String> missingSkills;

    private List<String> suggestions;

}