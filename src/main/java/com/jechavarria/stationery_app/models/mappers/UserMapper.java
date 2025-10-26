package com.jechavarria.stationery_app.models.mappers;
import org.springframework.stereotype.Component;

import com.jechavarria.stationery_app.models.dtos.dtoUsers.UserRequest;
import com.jechavarria.stationery_app.models.dtos.dtoUsers.UserResponse;
import com.jechavarria.stationery_app.models.entities.Role;
import com.jechavarria.stationery_app.models.entities.User;

@Component // Esta clase es un bean, crea y se guarda en contenedor "OBJETO"
public class UserMapper {

    public UserResponse toResponse(User user){
        var response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getUserName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().getRoleName());
        return response;
    }

    public User toEntity(UserRequest userRequest){
        var user = new User();
        user.setUserName(userRequest.getUserName());
        user.setEmail(userRequest.getEmail());
        user.setPassword(userRequest.getPassword());

        // Asociar el rol usando solo el id recibido en el request
        var role = new Role();
        role.setId(userRequest.getIdRol());
        user.setRole(role);

        return user;
    }

}
