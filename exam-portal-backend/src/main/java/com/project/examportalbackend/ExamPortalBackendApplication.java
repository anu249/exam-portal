package com.project.examportalbackend;

import com.project.examportalbackend.models.Role;
import com.project.examportalbackend.repository.RoleRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ExamPortalBackendApplication {

  public static void main(String[] args) {
    SpringApplication.run(ExamPortalBackendApplication.class, args);
  }

  @Bean
  public ApplicationRunner initializer(RoleRepository repo) {
    return args -> {
      if (!repo.existsById("USER")) {
        repo.save(Role.builder()
            .roleName("USER")
            .roleDescription("Default Role provided to each user")
            .build());
      }
      if (!repo.existsById("ADMIN")) {
        repo.save(Role.builder()
            .roleName("ADMIN")
            .roleDescription("Superuser, who has access for all functionality")
            .build());
      }
    };
  }
}
