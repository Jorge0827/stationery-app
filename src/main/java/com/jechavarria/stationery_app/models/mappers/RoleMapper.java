package com.jechavarria.stationery_app.models.mappers;

import org.springframework.stereotype.Component;

import com.jechavarria.stationery_app.models.dtos.dtoRoles.RoleResponse;
import com.jechavarria.stationery_app.models.entities.Role;

@Component
public class RoleMapper {

    public RoleResponse toResponse(Role rol) {
        var response = new RoleResponse();
        response.setId(rol.getId());
        response.setRolName(rol.getRoleName());
        return response;
    }

}
