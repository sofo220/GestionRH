package com.gestionrh.config;

import com.gestionrh.entity.Department;
import com.gestionrh.entity.Employee;
import com.gestionrh.entity.EmployeeStatus;
import com.gestionrh.entity.Role;
import com.gestionrh.entity.RoleName;
import com.gestionrh.entity.User;
import com.gestionrh.repository.DepartmentRepository;
import com.gestionrh.repository.EmployeeRepository;
import com.gestionrh.repository.RoleRepository;
import com.gestionrh.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository,
                           DepartmentRepository departmentRepository, EmployeeRepository employeeRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        for (RoleName roleName : RoleName.values()) {
            roleRepository.findByName(roleName).orElseGet(() -> {
                Role role = new Role();
                role.setName(roleName);
                return roleRepository.save(role);
            });
        }
        Role adminRole = roleRepository.findByName(RoleName.ADMIN).orElseThrow();
        User admin = userRepository.findByEmail("admin@gestionrh.com").orElseGet(User::new);
        admin.setName("Administrateur");
        admin.setEmail("admin@gestionrh.com");
        if (admin.getPassword() == null || !passwordEncoder.matches("admin123", admin.getPassword())) {
            admin.setPassword(passwordEncoder.encode("admin123"));
        }
        admin.setRole(adminRole);
        userRepository.save(admin);

        Department rh = ensureDepartment("Ressources Humaines", "Gestion administrative et recrutement");
        Department it = ensureDepartment("Informatique", "Developpement et infrastructure");
        ensureEmployee("Sara", "El Amrani", "sara@gestionrh.com", "Responsable RH", new BigDecimal("12000"), rh);
        ensureEmployee("Yassine", "Benali", "yassine@gestionrh.com", "Developpeur Java", new BigDecimal("15000"), it);
    }

    private Department ensureDepartment(String name, String description) {
        return departmentRepository.findAll().stream()
                .filter(department -> department.getName().equals(name))
                .findFirst()
                .orElseGet(() -> {
                    Department department = new Department();
                    department.setName(name);
                    department.setDescription(description);
                    return departmentRepository.save(department);
                });
    }

    private void ensureEmployee(String firstName, String lastName, String email, String position, BigDecimal salary, Department department) {
        if (employeeRepository.existsByEmail(email)) {
            return;
        }
        Employee employee = new Employee();
        employee.setFirstName(firstName);
        employee.setLastName(lastName);
        employee.setEmail(email);
        employee.setPhone("0600000000");
        employee.setAddress("Casablanca");
        employee.setPosition(position);
        employee.setSalary(salary);
        employee.setHireDate(LocalDate.now().minusYears(1));
        employee.setStatus(EmployeeStatus.ACTIF);
        employee.setDepartment(department);
        employeeRepository.save(employee);
    }
}
