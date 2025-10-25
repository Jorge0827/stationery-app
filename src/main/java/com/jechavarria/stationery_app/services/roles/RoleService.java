package com.jechavarria.stationery_app.services.roles;

import java.util.List;

import com.jechavarria.stationery_app.models.dtos.dtoRoles.RoleResponse;

public interface RoleService {

    List<RoleResponse> getAll();

    RoleResponse getById(Integer id);

}
