package com.jechavarria.stationery_app.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
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

import com.jechavarria.stationery_app.models.dtos.dtoSales.SalesRequest;
import com.jechavarria.stationery_app.models.dtos.dtoSales.SalesResponse;
import com.jechavarria.stationery_app.models.dtos.dtoSales.TopProductResponse;
import com.jechavarria.stationery_app.services.sales.SaleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<SalesResponse>> getAll() {
        var sales = saleService.getAll();
        return ResponseEntity.ok(sales);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/by-date")
    public ResponseEntity<List<SalesResponse>> getByDateRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        var sales = saleService.getByDateRange(start, end);
        return ResponseEntity.ok(sales);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/by-month")
    public ResponseEntity<List<SalesResponse>> getByMonth(
            @RequestParam("year") Integer year,
            @RequestParam("month") Integer month) {
        var sales = saleService.getByMonth(year, month);
        return ResponseEntity.ok(sales);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/top-products")
    public ResponseEntity<List<TopProductResponse>> getTopProducts(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam(name = "limit", required = false) Integer limit) {
        var result = saleService.getTopProducts(start, end, limit);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'EMPLEADO')")
    @PostMapping
    public ResponseEntity<SalesResponse> create(@Valid @RequestBody SalesRequest data) {

        var newSale = saleService.create(data);

        return ResponseEntity.status(HttpStatus.CREATED).body(newSale);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<SalesResponse> update(@PathVariable Integer id, @Valid @RequestBody SalesRequest data) {
        var updateSale = saleService.update(id, data);

        return ResponseEntity.ok(updateSale);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<SalesResponse> delete(@Valid @PathVariable Integer id) {
        var deleteSale = saleService.delete(id);

        return ResponseEntity.ok(deleteSale);

    }
}
