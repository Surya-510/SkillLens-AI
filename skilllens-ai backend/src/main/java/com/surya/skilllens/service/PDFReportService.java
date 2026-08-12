package com.surya.skilllens.service;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.surya.skilllens.dto.ResumeAnalysisResponse;
import com.surya.skilllens.entity.Resume;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PDFReportService {

    public byte[] generateReport(
            Resume resume,
            ResumeAnalysisResponse analysis) {

        try {

            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();

            Document document = new Document();

            PdfWriter.getInstance(
                    document,
                    outputStream
            );

            document.open();

            // Fonts
            Font title =
                    new Font(
                            Font.HELVETICA,
                            20,
                            Font.BOLD
                    );

            Font heading =
                    new Font(
                            Font.HELVETICA,
                            14,
                            Font.BOLD
                    );

            Font normal =
                    new Font(
                            Font.HELVETICA,
                            11
                    );

            Font scoreFont =
                    new Font(
                            Font.HELVETICA,
                            18,
                            Font.BOLD
                    );

            // --------------------------------
            // TITLE
            // --------------------------------

            document.add(
                    new Paragraph(
                            "SkillLens AI Resume Report",
                            title
                    )
            );

            document.add(
                    new Paragraph(" ")
            );

            // --------------------------------
            // RESUME DETAILS
            // --------------------------------

            document.add(
                    new Paragraph(
                            "Resume Details",
                            heading
                    )
            );

            document.add(
                    new Paragraph(
                            "File Name: "
                                    + resume.getFileName(),
                            normal
                    )
            );

            document.add(
                    new Paragraph(
                            "Uploaded At: "
                                    + resume.getUploadedAt(),
                            normal
                    )
            );

            document.add(
                    new Paragraph(" ")
            );

            // --------------------------------
            // ATS SCORE
            // --------------------------------

            document.add(
                    new Paragraph(
                            "ATS Score",
                            heading
                    )
            );

            document.add(
                    new Paragraph(
                            analysis.getAtsScore()
                                    + " / 100",
                            scoreFont
                    )
            );

            document.add(
                    new Paragraph(" ")
            );

            // --------------------------------
            // SUMMARY
            // --------------------------------

            document.add(
                    new Paragraph(
                            "Professional Summary",
                            heading
                    )
            );

            document.add(
                    new Paragraph(
                            analysis.getSummary(),
                            normal
                    )
            );

            document.add(
                    new Paragraph(" ")
            );

            // --------------------------------
            // SKILLS
            // --------------------------------

            document.add(
                    new Paragraph(
                            "Skills",
                            heading
                    )
            );

            if (analysis.getSkills() != null) {

                for (String skill :
                        analysis.getSkills()) {

                    document.add(
                            new Paragraph(
                                    "• " + skill,
                                    normal
                            )
                    );
                }
            }

            document.add(
                    new Paragraph(" ")
            );

            // --------------------------------
            // MISSING SKILLS
            // --------------------------------

            document.add(
                    new Paragraph(
                            "Missing Skills",
                            heading
                    )
            );

            if (analysis.getMissingSkills() != null) {

                for (String skill :
                        analysis.getMissingSkills()) {

                    document.add(
                            new Paragraph(
                                    "• " + skill,
                                    normal
                            )
                    );
                }
            }

            document.add(
                    new Paragraph(" ")
            );

            // --------------------------------
            // SUGGESTIONS
            // --------------------------------

            document.add(
                    new Paragraph(
                            "Suggestions",
                            heading
                    )
            );

            if (analysis.getSuggestions() != null) {

                for (String suggestion :
                        analysis.getSuggestions()) {

                    document.add(
                            new Paragraph(
                                    "• " + suggestion,
                                    normal
                            )
                    );
                }
            }

            document.add(
                    new Paragraph(" ")
            );

            // --------------------------------
            // FOOTER
            // --------------------------------

            document.add(
                    new Paragraph(
                            "----------------------------------------"
                    )
            );

            document.add(
                    new Paragraph(
                            "Generated by SkillLens AI",
                            normal
                    )
            );

            document.close();

            return outputStream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate PDF report",
                    e
            );
        }
    }
}