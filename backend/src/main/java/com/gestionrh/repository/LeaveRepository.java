package com.gestionrh.repository;

import com.gestionrh.entity.LeaveRequest;
import com.gestionrh.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {
    long countByStatus(LeaveStatus status);
}
