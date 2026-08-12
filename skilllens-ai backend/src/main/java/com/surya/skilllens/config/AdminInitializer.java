package com.surya.skilllens.config;

import com.surya.skilllens.entity.User;
import com.surya.skilllens.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${skilllens.admin.username:admin}")
    private String username;

    @Value("${skilllens.admin.password:Admin@123}")
    private String password;

    public AdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        userRepository.findByUsername(username).orElseGet(() -> {
            User admin = new User();
            admin.setUsername(username);
            admin.setPassword(passwordEncoder.encode(password));
            admin.setRole("ADMIN");
            return userRepository.save(admin);
        });
    }
}
