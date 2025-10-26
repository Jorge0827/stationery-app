package com.jechavarria.stationery_app.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jechavarria.stationery_app.models.dtos.dtoUsers.UserRequest;
import com.jechavarria.stationery_app.models.dtos.dtoUsers.UserResponse;
import com.jechavarria.stationery_app.services.users.UserService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.extern.slf4j.Slf4j;




@Slf4j
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAll() {
        var users = userService.getAll();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/create")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest data) {
        var user = userService.create(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PutMapping("{id}")
    public ResponseEntity<UserResponse> updateUser(@Valid @PathVariable Integer id, @RequestBody UserRequest data) {
        var updateUser = userService.update(id, data);
        return ResponseEntity.ok(updateUser);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<UserResponse> deleteUser(@PathVariable @Min(1) Integer id){
        var deleteUser = userService.delete(id);
        return ResponseEntity.ok(deleteUser);
    }

    
    



    

    

    

}
