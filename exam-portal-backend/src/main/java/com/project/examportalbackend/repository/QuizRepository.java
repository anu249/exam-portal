package com.project.examportalbackend.repository;

import com.project.examportalbackend.models.Category;
import com.project.examportalbackend.models.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByCategory(Category category);

    @Query("SELECT q FROM Quiz q LEFT JOIN FETCH q.questions WHERE q.quizId = :quizId")
    Quiz findQuizWithQuestions(@Param("quizId") Long quizId);

}
