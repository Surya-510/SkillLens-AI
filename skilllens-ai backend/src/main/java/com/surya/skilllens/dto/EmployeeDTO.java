package com.surya.skilllens.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

public class EmployeeDTO {



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public Double getResumeScore() {
        return resumeScore;
    }

    public void setResumeScore(Double resumeScore) {
        this.resumeScore = resumeScore;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    private Long id;

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter valid email")
    private String email;

    @NotBlank(message = "Mobile is required")
    private String mobile;

    @NotBlank(message = "College is required")
    private String college;

    @NotBlank(message = "Degree is required")
    private String degree;

    @NotBlank(message = "Skills are required")
    private String skills;

    @NotNull(message = "Resume Score is required")
    private Double resumeScore;

    @NotNull(message = "Experience is required")
    @PositiveOrZero(message = "Experience cannot be negative")
    private Integer experience;

    @NotBlank(message = "Status is required")
    private String status;


    // Generate Getters and Setters
}