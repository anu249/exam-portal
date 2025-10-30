


package com.project.examportalbackend.models;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor          
@AllArgsConstructor         
public class LoginResponse {
    private Long userId;
    private String username;
    private String firstName;
    private String lastName;
    private Set<Role> roles;
    private String message;
}
