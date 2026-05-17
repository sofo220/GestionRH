package com.gestionrh.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record DashboardResponse(
        long totalEmployees,
        long pendingLeaves,
        BigDecimal totalPayroll,
        List<Map<String, Object>> employeesByDepartment,
        Map<String, Long> leavesByStatus,
        List<Map<String, Object>> payrollEvolution
) {}
