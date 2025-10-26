package com.jechavarria.stationery_app.models.dtos.dtoUsers;

import lombok.Data;

@Data
public class UserResponse {

    private Integer id;
    private String name;
    private String email;
    private String role;

}
