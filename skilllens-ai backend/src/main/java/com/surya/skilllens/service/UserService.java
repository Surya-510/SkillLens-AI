package com.surya.skilllens.service;

import com.surya.skilllens.dto.UserDTO;
import com.surya.skilllens.entity.User;
import com.surya.skilllens.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // =====================================================
    // REGISTER
    // =====================================================

    public User register(UserDTO dto) {

        // Check username already exists
        if (userRepository.existsByUsername(dto.getUsername())) {

            throw new RuntimeException(
                    "Username already exists"
            );
        }

        User user = new User();

        user.setUsername(
                dto.getUsername()
        );

        // Encrypt password
        user.setPassword(
                passwordEncoder.encode(
                        dto.getPassword()
                )
        );

        // Default role
        user.setRole("USER");

        return userRepository.save(user);
    }


    // =====================================================
    // LOGIN
    // =====================================================

    public User login(
            String username,
            String password) {

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Invalid username or password"
                                )
                        );

        // Check password
        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid username or password"
            );
        }

        return user;
    }
    public Page<User> getAllUsers(int page, int size) {

        Pageable pageable =
                PageRequest.of(page, size);

        return userRepository.findAll(pageable);
    }
}