package com.gestionrh.controller;

import com.gestionrh.dto.EmployeeRequest;
import com.gestionrh.entity.Employee;
import com.gestionrh.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public List<Employee> all(@RequestParam(required = false) String search) {
        return employeeService.findAll(search);
    }

    @GetMapping("/{id}")
    public Employee one(@PathVariable Long id) {
        return employeeService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','RH')")
    public Employee create(@Valid @RequestBody EmployeeRequest request) {
        return employeeService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RH')")
    public Employee update(@PathVariable Long id, @Valid @RequestBody EmployeeRequest request) {
        return employeeService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RH')")
    public void delete(@PathVariable Long id) {
        employeeService.delete(id);
    }
}
