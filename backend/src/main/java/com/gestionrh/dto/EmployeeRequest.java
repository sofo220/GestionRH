package com.gestionrh.dto;

import com.gestionrh.entity.EmployeeStatus;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record EmployeeRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @Email @NotBlank String email,
        String phone,
        String address,
        @NotBlank String position,
        @NotNull @PositiveOrZero BigDecimal salary,
        @NotNull LocalDate hireDate,
        EmployeeStatus status,
        Long departmentId
) {}
