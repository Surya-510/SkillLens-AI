package com.surya.skilllens.dto;

import lombok.Data;
import java.util.List;

@Data
public class InterviewQuestionResponse {

    private List<InterviewQA> technicalQuestions;

    private List<InterviewQA> hrQuestions;

}