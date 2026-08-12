package com.surya.skilllens.config;

import com.surya.skilllens.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Override
    protected boolean shouldNotFilter(
            HttpServletRequest request) {

        return request.getServletPath()
                .startsWith("/auth/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // =====================================================
        // JWT REQUEST DEBUG
        // =====================================================

        System.out.println(
                "===== JWT FILTER HIT ===== "
                        + request.getMethod()
                        + " "
                        + request.getRequestURI()
        );

        String authHeader =
                request.getHeader("Authorization");

        System.out.println(
                "Authorization Header = "
                        + authHeader
        );

        if (authHeader != null &&
                authHeader.startsWith("Bearer ")) {

            String token =
                    authHeader.substring(7);

            try {

                String username =
                        jwtService.extractUsername(token);

                String role =
                        jwtService.extractRole(token);

                System.out.println(
                        "Authenticated User : "
                                + username
                );

                System.out.println(
                        "Authenticated Role : "
                                + role
                );

                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority(
                                "ROLE_" + role
                        );

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                Collections.singletonList(
                                        authority
                                )
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );

            } catch (Exception e) {

                System.out.println(
                        "JWT ERROR: "
                                + e.getMessage()
                );

                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );

                response.getWriter().write(
                        "Invalid or Expired JWT Token"
                );

                return;
            }
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}