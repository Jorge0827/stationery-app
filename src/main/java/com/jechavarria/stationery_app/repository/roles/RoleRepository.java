package com.jechavarria.stationery_app.repository.roles;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jechavarria.stationery_app.models.entities.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    Optional<Role> findByRoleName(String roleName);

}
