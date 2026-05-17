package com.gestionrh.repository;

import com.gestionrh.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    boolean existsByEmail(String email);

    @Query("""
        select e from Employee e
        left join e.department d
        where lower(e.firstName) like lower(concat('%', :q, '%'))
           or lower(e.lastName) like lower(concat('%', :q, '%'))
           or lower(e.email) like lower(concat('%', :q, '%'))
           or lower(e.position) like lower(concat('%', :q, '%'))
           or lower(d.name) like lower(concat('%', :q, '%'))
    """)
    List<Employee> search(@Param("q") String query);

    @Query("select coalesce(sum(e.salary), 0) from Employee e")
    BigDecimal totalSalary();
}
