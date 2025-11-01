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

    @GetMapping
    public ResponseEntity<List<PurchaseResponse>> getAll() {
        var purchases = purchaseService.getAll();
        return ResponseEntity.ok(purchases);
    }

    @PostMapping
    public ResponseEntity<PurchaseResponse> create(@Valid @RequestBody PurchaseRequest data) {
        var createPurchase = purchaseService.create(data);

        return ResponseEntity.status(HttpStatus.CREATED).body(createPurchase);
    }


    @PutMapping("/{id}")
    public ResponseEntity<PurchaseResponse> update(@PathVariable Integer id, @Valid @RequestBody PurchaseRequest data) {
        var updatePurchase = purchaseService.update(id, data);

        return ResponseEntity.ok(updatePurchase);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<PurchaseResponse> delete(@Valid @PathVariable Integer id) {
        var deletePurchase = purchaseService.delete(id);

        return ResponseEntity.ok(deletePurchase);
    }

    
    

}
