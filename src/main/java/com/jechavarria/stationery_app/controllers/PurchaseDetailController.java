package com.jechavarria.stationery_app.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jechavarria.stationery_app.models.dtos.dtoPurchaseDetail.PurchaseDetailRequest;
import com.jechavarria.stationery_app.models.dtos.dtoPurchaseDetail.PurchaseDetailResponse;
import com.jechavarria.stationery_app.services.PurchaseDetail.PurchaseDetailService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/purchasesDetails")
public class PurchaseDetailController {

    private final PurchaseDetailService purchaseDetailService;

    public PurchaseDetailController(PurchaseDetailService purchaseDetailService) {
        this.purchaseDetailService = purchaseDetailService;
    }

    @GetMapping
    public ResponseEntity<List<PurchaseDetailResponse>> getAll() {
        var details = purchaseDetailService.getAllDetails();

        return ResponseEntity.ok(details);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<PurchaseDetailResponse> create(@Valid @RequestBody PurchaseDetailRequest data) {

        var newDetail = purchaseDetailService.create(data);

        return ResponseEntity.status(HttpStatus.CREATED).body(newDetail);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{idPurchase}/{idProduct}")
    public ResponseEntity<PurchaseDetailResponse> update(
            @PathVariable Integer idPurchase, @PathVariable String idProduct,
            @Valid @RequestBody PurchaseDetailRequest data) {

        var updateDetail = purchaseDetailService.update(idPurchase, idProduct, data);

        return ResponseEntity.ok(updateDetail);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{idPurchase}/{idProduct}")
    public ResponseEntity<PurchaseDetailResponse> delete(
            @PathVariable Integer idPurchase, @Valid @PathVariable String idProduct) {
        var deleteDetail = purchaseDetailService.delete(idPurchase, idProduct);

        return ResponseEntity.ok(deleteDetail);

    }

}
