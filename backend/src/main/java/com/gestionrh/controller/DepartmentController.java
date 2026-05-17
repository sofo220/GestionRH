package com.gestionrh.controller;

import com.gestionrh.dto.DepartmentRequest;
import com.gestionrh.entity.Department;
import com.gestionrh.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {
    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public List<Department> all() {
        return departmentService.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','RH')")
    public Department create(@Valid @RequestBody DepartmentRequest request) {
        return departmentService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RH')")
    public Department update(@PathVariable Long id, @Valid @RequestBody DepartmentRequest request) {
        return departmentService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RH')")
    public void delete(@PathVariable Long id) {
        departmentService.delete(id);
    }
}
