package com.gestionrh.repository;

import com.gestionrh.entity.Role;
import com.gestionrh.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
