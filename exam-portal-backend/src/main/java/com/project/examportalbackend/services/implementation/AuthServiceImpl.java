package com.project.examportalbackend.services.implementation;

import com.project.examportalbackend.models.*;
import com.project.examportalbackend.repository.RoleRepository;
import com.project.examportalbackend.repository.UserRepository;
import com.project.examportalbackend.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.project.examportalbackend.models.Users;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Override
	public Users registerUserService(Users user) throws Exception {
		Users temp = userRepository.findByUsername(user.getUsername());
		if (temp != null) {
			throw new Exception("User Already Exists");
		} else {
			
			Role role = roleRepository.findById("USER")
				    .orElseThrow(() -> new IllegalStateException("Default role USER not found"));
				Set<Role> roles = new HashSet<>();
				roles.add(role);
				user.setRoles(roles);
			// store plain password (for now only)
			user.setPassword(user.getPassword());
			return userRepository.save(user);
		}
	}

	@Override
	public LoginResponse loginUserService(LoginRequest loginRequest) throws Exception {
		// Find user by username
		Users user = userRepository.findByUsername(loginRequest.getUsername());
		if (user == null) {
			throw new Exception("Invalid username or password");
		}

		// Compare passwords directly (plain-text)
		if (!loginRequest.getPassword().equals(user.getPassword())) {
			throw new Exception("Invalid username or password");
		}

		// Build and return a simple response
		LoginResponse response = new LoginResponse();
		response.setUserId(user.getUserId());
		response.setUsername(user.getUsername());
		response.setFirstName(user.getFirstName());
		response.setLastName(user.getLastName());
		response.setRoles(user.getRoles());
		response.setMessage("Login successful");

		return response;
	}

}
