package com.project.examportalbackend.controllers;

import com.project.examportalbackend.models.Question;
import com.project.examportalbackend.models.Quiz;
import com.project.examportalbackend.models.QuizResult;
import com.project.examportalbackend.services.QuestionService;
import com.project.examportalbackend.services.QuizResultService;
import com.project.examportalbackend.services.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

@CrossOrigin
@RestController
@RequestMapping("/api/quizResult")
public class QuizResultController {

    @Autowired
    private QuestionService questionService;
    @Autowired
    private QuizService quizService;

    @Autowired
    private QuizResultService quizResultService;

    @PostMapping(value = "/submit", params = {"userId", "quizId"})
    public ResponseEntity<?> submitQuiz(
        @RequestParam Long userId,
        @RequestParam Long quizId,
        @RequestBody Map<String, String> answers
    ) {
        Quiz quiz = quizService.getQuiz(quizId);
        int totalQuestions = quiz.getQuestions().size();

        // marks per question: use a single source of truth (here: 5)
        final float marksPerQuestion = 5f;

        int numCorrectAnswers = 0;

        for (Map.Entry<String, String> entry : answers.entrySet()) {
            Long quesId = null;
            try {
                quesId = Long.valueOf(entry.getKey());
            } catch (NumberFormatException ignored) {
                continue; // bad key
            }

            Question q = questionService.getQuestion(quesId);
            if (q == null) continue;

            String submitted = safe(entry.getValue());
            String correct   = safe(q.getAnswer());

            // If frontend sent option key/index, translate to the text
            if (submitted.equalsIgnoreCase("option1") || submitted.equals("1")) submitted = safe(q.getOption1());
            else if (submitted.equalsIgnoreCase("option2") || submitted.equals("2")) submitted = safe(q.getOption2());
            else if (submitted.equalsIgnoreCase("option3") || submitted.equals("3")) submitted = safe(q.getOption3());
            else if (submitted.equalsIgnoreCase("option4") || submitted.equals("4")) submitted = safe(q.getOption4());

            if (!submitted.isEmpty() && submitted.equalsIgnoreCase(correct)) {
                numCorrectAnswers++;
            }
        }

        float totalObtainedMarks = numCorrectAnswers * marksPerQuestion;

        QuizResult quizResult = new QuizResult();
        quizResult.setUserId(userId);
        quizResult.setQuiz(quiz);
        quizResult.setTotalObtainedMarks(totalObtainedMarks);

        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Kolkata"));
        quizResult.setAttemptDatetime(now.toLocalDate() + " " + now.toLocalTime().toString().substring(0, 8));

        quizResultService.addQuizResult(quizResult);

        return ResponseEntity.ok(quizResult);
    }

    private static String safe(String s) {
        return s == null ? "" : s.trim();
    }


    @GetMapping(value = "/", params = "userId")
    public ResponseEntity<?> getQuizResults(@RequestParam Long userId){
        List<QuizResult> quizResultsList =  quizResultService.getQuizResultsByUser(userId);
        Collections.reverse(quizResultsList);
        return ResponseEntity.ok(quizResultsList);
    }

    @GetMapping(value = "/all")
    public ResponseEntity<?> getQuizResults(){
        List<QuizResult> quizResultsList =  quizResultService.getQuizResults();
        Collections.reverse(quizResultsList);
        return ResponseEntity.ok(quizResultsList);
    }
}
