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

import com.jechavarria.stationery_app.models.dtos.dtoSuppliers.SupplierRequest;
import com.jechavarria.stationery_app.models.dtos.dtoSuppliers.SupplierResponse;
import com.jechavarria.stationery_app.services.suppliers.SupplierService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<SupplierResponse>> getAll() {
        var suppliers = supplierService.getAll();
        return ResponseEntity.ok(suppliers);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<SupplierResponse> create(@Valid @RequestBody SupplierRequest data) {
        
        var createSupplier = supplierService.create(data);

        return ResponseEntity.status(HttpStatus.CREATED).body(createSupplier);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public SupplierResponse update(@PathVariable Integer id, @RequestBody SupplierRequest entity) {
        return supplierService.update(id, entity);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public SupplierResponse delete(@PathVariable Integer id){
        return supplierService.delete(id);
    }
    
    
    
    

}
