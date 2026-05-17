package com.gestionrh.service;

import com.gestionrh.dto.AuthResponse;
import com.gestionrh.dto.LoginRequest;
import com.gestionrh.dto.RegisterRequest;
import com.gestionrh.entity.Role;
import com.gestionrh.entity.RoleName;
import com.gestionrh.entity.User;
import com.gestionrh.repository.RoleRepository;
import com.gestionrh.repository.UserRepository;
import com.gestionrh.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository,
                       RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Email ou mot de passe incorrect"));
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().getName().name())
                .build();
        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().getName().name());
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email deja utilise");
        }
        RoleName roleName = request.role() == null ? RoleName.EMPLOYE : request.role();
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalArgumentException("Role introuvable"));
        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(role);
        User saved = userRepository.save(user);
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(saved.getEmail())
                .password(saved.getPassword())
                .roles(saved.getRole().getName().name())
                .build();
        return new AuthResponse(jwtService.generateToken(userDetails), saved.getId(), saved.getName(), saved.getEmail(), saved.getRole().getName().name());
    }
}
