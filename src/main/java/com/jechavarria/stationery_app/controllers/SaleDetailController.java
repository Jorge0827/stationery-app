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

import com.jechavarria.stationery_app.models.dtos.dtoSaleDetail.SaleDetailRequest;
import com.jechavarria.stationery_app.models.dtos.dtoSaleDetail.SaleDetailResponse;
import com.jechavarria.stationery_app.services.saleDetail.SaleDetailService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/salesDetails")
public class SaleDetailController {

    private final SaleDetailService saleDetailService;

    public SaleDetailController(SaleDetailService saleDetailService) {
        this.saleDetailService = saleDetailService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<SaleDetailResponse>> getAll() {
        var details = saleDetailService.getAllSales();
        return ResponseEntity.ok(details);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/bySale/{idSale}")
    public ResponseEntity<List<SaleDetailResponse>> getBySale(@PathVariable Integer idSale) {
        var details = saleDetailService.getDetailsBySaleId(idSale);
        return ResponseEntity.ok(details);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<SaleDetailResponse> create(@Valid @RequestBody SaleDetailRequest data) {

        var newDetail = saleDetailService.create(data);

        return ResponseEntity.status(HttpStatus.CREATED).body(newDetail);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{idSale}/{idProduct}")
    public ResponseEntity<SaleDetailResponse> update(
            @PathVariable Integer idSale, @PathVariable String idProduct,
            @Valid @RequestBody SaleDetailRequest data) {

        var updateDetail = saleDetailService.update(idSale, idProduct, data);

        return ResponseEntity.ok(updateDetail);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{idSale}/{idProduct}")
    public ResponseEntity<SaleDetailResponse> delete(
            @PathVariable Integer idSale, @Valid @PathVariable String idProduct) {
        var deleteDetail = saleDetailService.delete(idSale, idProduct);

        return ResponseEntity.ok(deleteDetail);

    }

}
