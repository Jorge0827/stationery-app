package com.jechavarria.stationery_app.controllers;

import java.time.LocalDate;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.format.annotation.DateTimeFormat;

import com.jechavarria.stationery_app.models.dtos.dtoPurchases.PurchaseRequest;
import com.jechavarria.stationery_app.models.dtos.dtoPurchases.PurchaseResponse;
import com.jechavarria.stationery_app.services.Purchases.PurchaseService;

import jakarta.validation.Valid;




@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<PurchaseResponse>> getAll() {
        var purchases = purchaseService.getAll();
        return ResponseEntity.ok(purchases);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/by-date")
    public ResponseEntity<List<PurchaseResponse>> getByDateRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        var purchases = purchaseService.getByDateRange(start, end);
        return ResponseEntity.ok(purchases);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/by-supplier/{supplierId}")
    public ResponseEntity<List<PurchaseResponse>> getBySupplier(@PathVariable Integer supplierId) {
        var purchases = purchaseService.getBySupplier(supplierId);
        return ResponseEntity.ok(purchases);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'EMPLEADO')")
    @PostMapping
    public ResponseEntity<PurchaseResponse> create(@Valid @RequestBody PurchaseRequest data) {
        var createPurchase = purchaseService.create(data);

        return ResponseEntity.status(HttpStatus.CREATED).body(createPurchase);
    }


    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'EMPLEADO')")
    @PutMapping("/{id}")
    public ResponseEntity<PurchaseResponse> update(@PathVariable Integer id, @Valid @RequestBody PurchaseRequest data) {
        var updatePurchase = purchaseService.update(id, data);

        return ResponseEntity.ok(updatePurchase);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<PurchaseResponse> delete(@Valid @PathVariable Integer id) {
        var deletePurchase = purchaseService.delete(id);

        return ResponseEntity.ok(deletePurchase);
    }

    
    

}
