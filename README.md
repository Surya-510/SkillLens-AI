# SkillLens AI

SkillLens AI is an AI-powered resume analysis and career preparation platform designed to help job seekers understand their resume quality, identify skill gaps, and prepare for interviews.

The application allows users to upload their resume, analyze it using AI, view ATS-related information, identify missing skills based on a target role, receive learning suggestions, and generate technical and HR interview questions.

---

## Features

- User Registration and Login
- JWT-based Authentication
- Secure Resume Upload
- PDF Resume Parsing
- AI Resume Analysis
- ATS Score Analysis
- Skill Gap Analysis
- Target Role Based Skill Comparison
- Missing Skill Identification
- AI Learning Recommendations
- Technical Interview Question Generation
- HR Interview Question Generation
- Resume Dashboard
- Resume History
- Resume Details
- Original Resume Download
- AI Report Download
- Resume Delete
- Activity History
- Responsive Frontend
- AI Response Validation and Retry
- Resume-specific AI Analysis Cache

---

## Technology Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Bootstrap
- React Router
- Axios
- React Icons
- React Toastify

### Backend

- Java 21
- Spring Boot
- Spring Security
- Spring AI
- REST APIs
- JWT Authentication
- Maven

### AI

- Ollama
- Llama 3.2
- Spring AI ChatClient

### Database

- MySQL

### Tools

- IntelliJ IDEA
- MySQL Workbench
- Postman
- Swagger UI
- Git
- GitHub

---

## System Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │                     │
                    │ Dashboard           │
                    │ Resume Upload       │
                    │ ATS Analysis        │
                    │ Skill Gap            │
                    │ Interview            │
                    └──────────┬──────────┘
                               │
                         REST API / JWT
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Spring Boot       │
                    │      Backend        │
                    │                     │
                    │ Controllers         │
                    │ Services            │
                    │ Security            │
                    │ PDF Parser          │
                    └───────┬─────┬───────┘
                            │     │
                 ┌──────────┘     └──────────┐
                 ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │     MySQL       │         │     Ollama      │
        │    Database     │         │    Llama 3.2    │
        │                 │         │                 │
        │ Users           │         │ Resume Analysis │
        │ Resumes         │         │ Skill Gap       │
        │ Job Analysis    │         │ Interview       │
        │ Activity        │         │ Suggestions     │
        └─────────────────┘         └─────────────────┘
