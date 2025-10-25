package com.jechavarria.stationery_app.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jechavarria.stationery_app.models.dtos.dtoRoles.RoleResponse;
import com.jechavarria.stationery_app.services.roles.RoleService;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

        private final RoleService roleService;

        public RoleController(RoleService roleService) {
            this.roleService = roleService;
        }

        @GetMapping
        public ResponseEntity<List<RoleResponse>> getAllRoles() {
            List<RoleResponse> roles = roleService.getAll();
            return ResponseEntity.ok(roles);
        }

        @GetMapping("/{id}")
        public ResponseEntity<RoleResponse> getById(@PathVariable Integer id) {
            RoleResponse rol = roleService.getById(id);
            return ResponseEntity.ok(rol);
        }

    }

