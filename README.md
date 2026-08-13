# 🚀 SkillLens AI

**SkillLens AI** is an AI-powered career assistance platform designed to help users analyze their resumes, identify missing skills, and prepare for technical and HR interviews.

---

## 🎥 Project Demo

Watch the complete demonstration of SkillLens AI:

https://github.com/user-attachments/assets/6d9cbd9c-0a45-4d6f-862a-4427a2f42e7c


**▶️ SkillLens AI – Project Demo**

---

## ✨ Features

* 🔐 User Registration & Login
* 📄 Resume Upload
* 🤖 AI-powered Resume Analysis
* 🧠 Skill Identification
* 📊 Missing Skill Detection
* 💡 AI-based Skill Improvement Suggestions
* 💻 Technical Interview Questions
* 👔 HR Interview Questions
* 🔑 JWT Authentication
* 🗄️ MySQL Database Integration

---

## 🛠️ Technologies Used

### Frontend

* HTML
* CSS
* JavaScript
* Bootstrap

### Backend

* Java
* Spring Boot
* Spring Security
* REST API
* JWT

### Database

* MySQL

### AI

* Spring AI
* Ollama
* Llama 3.2

### Tools

* Git
* GitHub
* Postman
* Swagger

---

## 🏗️ System Architecture

```text
User
  ↓
Frontend
  ↓
REST API
  ↓
Spring Boot Backend
  ↓
┌───────────────────────┐
│                       │
MySQL Database       Ollama AI
│                       │
└───────────────────────┘
  ↓
AI Analysis / Results
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Surya-510/SkillLens-AI.git
```

### 2. Open the Project

Open the project in:

* IntelliJ IDEA
* Eclipse
* VS Code

### 3. Configure MySQL

Create a MySQL database:

```sql
CREATE DATABASE skilllens_db;
```

Update your database configuration in the application properties.

### 4. Install Ollama

Install Ollama and download the required AI model:

```bash
ollama pull llama3.2
```

Make sure Ollama is running before starting the application.

### 5. Run the Spring Boot Application

Run:

```text
SkilllensAiApplication.java
```

The backend will start on:

```text
http://localhost:8080
```

---

## 🚀 How to Use

1. Register a new account.
2. Login to SkillLens AI.
3. Upload your resume.
4. Start AI resume analysis.
5. View your detected skills.
6. Check missing skills.
7. View AI-generated improvement suggestions.
8. Generate technical interview questions.
9. Generate HR interview questions.
10. Use the generated questions for interview preparation.

---

## 🔑 Authentication

SkillLens AI uses **JWT-based authentication** to secure user access and APIs.

---

## 🤖 AI Integration

SkillLens AI uses **Ollama with Llama 3.2** through **Spring AI** to provide:

* Resume analysis
* Skill identification
* Missing skill detection
* Improvement suggestions
* Technical interview questions
* HR interview questions

---

## 📚 API Documentation

The project provides API documentation using **Swagger / OpenAPI**.

After starting the application, open the Swagger UI from the configured Swagger endpoint.

---

## 👨‍💻 Developer

**Surya R**

B.Tech Information Technology

---

## ⭐ Project

If you find this project useful, consider giving the repository a ⭐.

**SkillLens AI – AI Powered Resume & Interview Assistant**
