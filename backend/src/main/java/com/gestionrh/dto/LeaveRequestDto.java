package com.gestionrh.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record LeaveRequestDto(
        @NotBlank String type,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        String reason,
        @NotNull Long employeeId
) {}
