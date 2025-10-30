package com.project.examportalbackend.services;

import com.project.examportalbackend.models.LoginRequest;
import com.project.examportalbackend.models.LoginResponse;
import com.project.examportalbackend.models.Users;

public interface AuthService {
    Users registerUserService(Users user) throws Exception;

    LoginResponse loginUserService(LoginRequest loginRequest) throws Exception;
}
