package com.jechavarria.stationery_app.services.roles;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jechavarria.stationery_app.exceptions.IdNotFoundException;
import com.jechavarria.stationery_app.models.dtos.dtoRoles.RoleResponse;
import com.jechavarria.stationery_app.models.entities.Role;
import com.jechavarria.stationery_app.models.mappers.RoleMapper;
import com.jechavarria.stationery_app.repository.roles.RoleRepository;

@Service
public class RoleServiceImpl implements RoleService {

    // Inyección
    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    public RoleServiceImpl(RoleRepository roleRepository, RoleMapper roleMapper) {
        this.roleRepository = roleRepository;
        this.roleMapper = roleMapper;
    }

    // Obtener todos los roles
    @Override
    public List<RoleResponse> getAll() {
        List<Role> roles = roleRepository.findAll();
        
        if (roles.isEmpty()) {
            return List.of();
        }

        return roles.stream()
                .map(roleMapper::toResponse)
                .toList();
    }

    @Override
    public RoleResponse getById(Integer id) {
        Role existingRol = roleRepository.findById(id)
                .orElseThrow(() -> new IdNotFoundException("No se encontró el ID: " + id));

        return roleMapper.toResponse(existingRol);
    }

}
