package com.surya.skilllens.service;

import com.surya.skilllens.entity.User;
import com.surya.skilllens.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(String username, String password) {

        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Username is required");
        }

        if (password == null || password.length() < 6) {
            throw new RuntimeException(
                    "Password must contain at least 6 characters"
            );
        }

        username = username.trim();

        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException(
                    "Username already exists"
            );
        }

        User user = new User();

        user.setUsername(username);

        user.setPassword(
                passwordEncoder.encode(password)
        );

        user.setRole("USER");

        return userRepository.save(user);
    }

    public User createAdmin(String username, String password) {

        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException(
                    "Username already exists"
            );
        }

        User admin = new User();

        admin.setUsername(username);

        admin.setPassword(
                passwordEncoder.encode(password)
        );

        admin.setRole("ADMIN");

        return userRepository.save(admin);
    }
}