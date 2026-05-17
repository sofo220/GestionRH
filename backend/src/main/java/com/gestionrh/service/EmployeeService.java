package com.gestionrh.service;

import com.gestionrh.dto.EmployeeRequest;
import com.gestionrh.entity.Department;
import com.gestionrh.entity.Employee;
import com.gestionrh.entity.EmployeeStatus;
import com.gestionrh.exception.ResourceNotFoundException;
import com.gestionrh.repository.DepartmentRepository;
import com.gestionrh.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    public EmployeeService(EmployeeRepository employeeRepository, DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
    }

    public List<Employee> findAll(String query) {
        if (query == null || query.isBlank()) {
            return employeeRepository.findAll();
        }
        return employeeRepository.search(query);
    }

    public Employee findById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employe introuvable"));
    }

    public Employee create(EmployeeRequest request) {
        if (employeeRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email deja utilise");
        }
        Employee employee = new Employee();
        apply(employee, request);
        return employeeRepository.save(employee);
    }

    public Employee update(Long id, EmployeeRequest request) {
        Employee employee = findById(id);
        apply(employee, request);
        return employeeRepository.save(employee);
    }

    public void delete(Long id) {
        employeeRepository.delete(findById(id));
    }

    private void apply(Employee employee, EmployeeRequest request) {
        Department department = null;
        if (request.departmentId() != null) {
            department = departmentRepository.findById(request.departmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Departement introuvable"));
        }
        employee.setFirstName(request.firstName());
        employee.setLastName(request.lastName());
        employee.setEmail(request.email());
        employee.setPhone(request.phone());
        employee.setAddress(request.address());
        employee.setPosition(request.position());
        employee.setSalary(request.salary());
        employee.setHireDate(request.hireDate());
        employee.setStatus(request.status() == null ? EmployeeStatus.ACTIF : request.status());
        employee.setDepartment(department);
    }
}
