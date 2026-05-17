package com.gestionrh.repository;

import com.gestionrh.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findTop6ByOrderByPaymentDateAsc();
}
