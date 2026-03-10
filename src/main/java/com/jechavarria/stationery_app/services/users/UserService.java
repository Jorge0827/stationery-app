package com.jechavarria.stationery_app.services.users;

import java.util.List;

import com.jechavarria.stationery_app.models.dtos.dtoLogin.LoginRequest;
import com.jechavarria.stationery_app.models.dtos.dtoLogin.LoginResponse;
import com.jechavarria.stationery_app.models.dtos.dtoUsers.PublicRegisterRequest;
import com.jechavarria.stationery_app.models.dtos.dtoUsers.UserRequest;
import com.jechavarria.stationery_app.models.dtos.dtoUsers.UserResponse;

public interface UserService {

    List <UserResponse> getAll();

    UserResponse createRegister(UserRequest userRequest);

    UserResponse update(Integer id, UserRequest userRequest);

    UserResponse delete(Integer id);

    LoginResponse login(LoginRequest body);

    UserResponse publicRegister(PublicRegisterRequest request);

}
