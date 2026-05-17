package com.gestionrh.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.LocalDate;

public record PayrollGenerateRequest(
        @NotNull Long employeeId,
        @NotNull @PositiveOrZero BigDecimal bonuses,
        @NotNull @PositiveOrZero BigDecimal deductions,
        @NotNull LocalDate paymentDate
) {}
