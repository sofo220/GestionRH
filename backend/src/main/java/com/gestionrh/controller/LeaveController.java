package com.gestionrh.controller;

import com.gestionrh.dto.LeaveRequestDto;
import com.gestionrh.entity.LeaveRequest;
import com.gestionrh.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {
    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @GetMapping
    public List<LeaveRequest> all() {
        return leaveService.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','RH')")
    public LeaveRequest create(@Valid @RequestBody LeaveRequestDto request) {
        return leaveService.create(request);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN','RH')")
    public LeaveRequest approve(@PathVariable Long id) {
        return leaveService.approve(id);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN','RH')")
    public LeaveRequest reject(@PathVariable Long id) {
        return leaveService.reject(id);
    }
}
