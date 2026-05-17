package com.gestionrh.service;

import com.gestionrh.dto.DepartmentRequest;
import com.gestionrh.entity.Department;
import com.gestionrh.exception.ResourceNotFoundException;
import com.gestionrh.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> findAll() {
        return departmentRepository.findAll();
    }

    public Department findById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Departement introuvable"));
    }

    public Department create(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.name())) {
            throw new IllegalArgumentException("Departement deja existant");
        }
        Department department = new Department();
        department.setName(request.name());
        department.setDescription(request.description());
        return departmentRepository.save(department);
    }

    public Department update(Long id, DepartmentRequest request) {
        Department department = findById(id);
        department.setName(request.name());
        department.setDescription(request.description());
        return departmentRepository.save(department);
    }

    public void delete(Long id) {
        departmentRepository.delete(findById(id));
    }
}
