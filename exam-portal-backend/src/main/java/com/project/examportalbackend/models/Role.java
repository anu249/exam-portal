package com.project.examportalbackend.models;

import jakarta.persistence.*;
import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "roles")
public class Role {

  @Id
  @Column(name = "role_name")
  private String roleName;

  @Column(name = "role_description")
  private String roleDescription;
}
