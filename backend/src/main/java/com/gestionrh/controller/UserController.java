package com.gestionrh.controller;

import com.gestionrh.entity.User;
import com.gestionrh.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> all() {
        return userRepository.findAll();
    }
}
