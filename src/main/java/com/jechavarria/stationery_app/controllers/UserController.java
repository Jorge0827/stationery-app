package com.jechavarria.stationery_app.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jechavarria.stationery_app.models.dtos.dtoLogin.LoginRequest;
import com.jechavarria.stationery_app.models.dtos.dtoLogin.LoginResponse;
import com.jechavarria.stationery_app.models.dtos.dtoUsers.UserRequest;
import com.jechavarria.stationery_app.models.dtos.dtoUsers.UserResponse;
import com.jechavarria.stationery_app.services.users.UserService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAll() {
        var users = userService.getAll();
        return ResponseEntity.ok(users);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping("auth/register")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest data) {
        var user = userService.createRegister(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("auth/login")
    public LoginResponse Login (@Valid @RequestBody LoginRequest body){
        return userService.login(body);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("{id}")
    public ResponseEntity<UserResponse> updateUser(@Valid @PathVariable Integer id, @RequestBody UserRequest data) {
        var updateUser = userService.update(id, data);
        return ResponseEntity.ok(updateUser);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("{id}")
    public ResponseEntity<UserResponse> deleteUser(@PathVariable @Min(1) Integer id){
        var deleteUser = userService.delete(id);
        return ResponseEntity.ok(deleteUser);
    }

    
    



    

    

    

}
