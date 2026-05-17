package com.gestionrh.service;

import com.gestionrh.dto.LeaveRequestDto;
import com.gestionrh.entity.Employee;
import com.gestionrh.entity.LeaveRequest;
import com.gestionrh.entity.LeaveStatus;
import com.gestionrh.exception.ResourceNotFoundException;
import com.gestionrh.repository.EmployeeRepository;
import com.gestionrh.repository.LeaveRepository;
import org.springframework.stereotype.Service;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveService {
    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;

    public LeaveService(LeaveRepository leaveRepository, EmployeeRepository employeeRepository) {
        this.leaveRepository = leaveRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<LeaveRequest> findAll() {
        return leaveRepository.findAll();
    }

    public LeaveRequest create(LeaveRequestDto request) {
        if (request.endDate().isBefore(request.startDate())) {
            throw new IllegalArgumentException("La date fin doit etre apres la date debut");
        }
        Employee employee = employeeRepository.findById(request.employeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employe introuvable"));
        LeaveRequest leave = new LeaveRequest();
        leave.setType(request.type());
        leave.setStartDate(request.startDate());
        leave.setEndDate(request.endDate());
        leave.setReason(request.reason());
        leave.setStatus(LeaveStatus.EN_ATTENTE);
        leave.setDays((int) ChronoUnit.DAYS.between(request.startDate(), request.endDate()) + 1);
        leave.setEmployee(employee);
        return leaveRepository.save(leave);
    }

    public LeaveRequest approve(Long id) {
        LeaveRequest leave = findById(id);
        leave.setStatus(LeaveStatus.ACCEPTE);
        return leaveRepository.save(leave);
    }

    public LeaveRequest reject(Long id) {
        LeaveRequest leave = findById(id);
        leave.setStatus(LeaveStatus.REFUSE);
        return leaveRepository.save(leave);
    }

    private LeaveRequest findById(Long id) {
        return leaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Demande de conge introuvable"));
    }
}
