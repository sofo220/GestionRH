package com.gestionrh.service;

import com.gestionrh.dto.DashboardResponse;
import com.gestionrh.entity.Department;
import com.gestionrh.entity.LeaveStatus;
import com.gestionrh.entity.Payroll;
import com.gestionrh.repository.DepartmentRepository;
import com.gestionrh.repository.EmployeeRepository;
import com.gestionrh.repository.LeaveRepository;
import com.gestionrh.repository.PayrollRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final LeaveRepository leaveRepository;
    private final PayrollRepository payrollRepository;

    public ReportService(EmployeeRepository employeeRepository, DepartmentRepository departmentRepository,
                         LeaveRepository leaveRepository, PayrollRepository payrollRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.leaveRepository = leaveRepository;
        this.payrollRepository = payrollRepository;
    }

    public DashboardResponse dashboard() {
        List<Map<String, Object>> employeesByDepartment = departmentRepository.findAll().stream()
                .map(this::departmentCount)
                .toList();
        Map<String, Long> leavesByStatus = new HashMap<>();
        for (LeaveStatus status : LeaveStatus.values()) {
            leavesByStatus.put(status.name(), leaveRepository.countByStatus(status));
        }
        List<Map<String, Object>> payrollEvolution = payrollRepository.findTop6ByOrderByPaymentDateAsc().stream()
                .map(this::payrollPoint)
                .toList();
        return new DashboardResponse(
                employeeRepository.count(),
                leaveRepository.countByStatus(LeaveStatus.EN_ATTENTE),
                employeeRepository.totalSalary(),
                employeesByDepartment,
                leavesByStatus,
                payrollEvolution
        );
    }

    private Map<String, Object> departmentCount(Department department) {
        Map<String, Object> item = new HashMap<>();
        item.put("name", department.getName());
        item.put("count", department.getEmployees().size());
        return item;
    }

    private Map<String, Object> payrollPoint(Payroll payroll) {
        Map<String, Object> item = new HashMap<>();
        item.put("date", payroll.getPaymentDate());
        item.put("amount", payroll.getNetSalary() == null ? BigDecimal.ZERO : payroll.getNetSalary());
        return item;
    }
}
