package com.surya.skilllens.auth;

import com.surya.skilllens.dto.LoginDTO;
import com.surya.skilllens.dto.UserDTO;
import com.surya.skilllens.entity.User;
import com.surya.skilllens.service.JwtService;
import com.surya.skilllens.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;


    // =====================================================
    // REGISTER
    // =====================================================

    @PostMapping("/register")
    public Map<String, Object> register(
            @RequestBody UserDTO dto) {

        User user = userService.register(dto);

        return Map.of(
                "message", "Registration successful",
                "username", user.getUsername(),
                "role", user.getRole()
        );
    }


    // =====================================================
    // LOGIN
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginDTO dto) {

        try {

            User user =
                    userService.login(
                            dto.getUsername(),
                            dto.getPassword()
                    );

            if (user == null) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(
                                "message",
                                "Incorrect username or password"
                        ));
            }

            String token =
                    jwtService.generateToken(
                            user.getUsername(),
                            user.getRole()
                    );

            return ResponseEntity.ok(token);

        } catch (RuntimeException e) {

            System.out.println(
                    "===== LOGIN FAILED ====="
            );

            System.out.println(
                    "Username: "
                            + dto.getUsername()
            );

            System.out.println(
                    "Reason: "
                            + e.getMessage()
            );

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Incorrect username or password"
                    ));
        }
    }
}