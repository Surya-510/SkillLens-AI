package com.surya.skilllens.service;

import org.springframework.stereotype.Service;

@Service
public class ATSScoreService {

    public int calculateScore(String resumeText){

        int score = 0;

        resumeText = resumeText.toLowerCase();

        // Contact
        if(resumeText.contains("@"))
            score += 10;

        // Education
        if(resumeText.contains("b.tech") ||
                resumeText.contains("bachelor"))
            score += 10;

        // Skills
        if(resumeText.contains("java"))
            score += 10;

        if(resumeText.contains("spring"))
            score += 10;

        if(resumeText.contains("mysql"))
            score += 10;

        // Projects
        if(resumeText.contains("project"))
            score += 15;

        // GitHub
        if(resumeText.contains("github"))
            score += 10;

        // LinkedIn
        if(resumeText.contains("linkedin"))
            score += 5;

        // Experience
        if(resumeText.contains("experience") ||
                resumeText.contains("intern"))
            score += 10;

        // Certifications
        if(resumeText.contains("certificate") ||
                resumeText.contains("certification"))
            score += 10;

        return Math.min(score,100);
    }

}