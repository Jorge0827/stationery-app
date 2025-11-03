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
import com.jechavarria.stationery_app.models.dtos.dtoSales.SalesRequest;
import com.jechavarria.stationery_app.models.dtos.dtoSales.SalesResponse;
import com.jechavarria.stationery_app.services.sales.SaleService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }


    @GetMapping
    public ResponseEntity<List<SalesResponse>> getAll() {

        var sales = saleService.getAll();
        return ResponseEntity.ok(sales);
    }

    @PostMapping
    public ResponseEntity<SalesResponse> create(@Valid @RequestBody SalesRequest data) {
        
        var newSale = saleService.create(data);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(newSale);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalesResponse> update(@PathVariable Integer id, @Valid @RequestBody SalesRequest data) {
        var updateSale = saleService.update(id, data);

        return ResponseEntity.ok(updateSale);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<SalesResponse> delete(@Valid @PathVariable Integer id) {
        var deleteSale = saleService.delete(id);

        return ResponseEntity.ok(deleteSale);
    
    }
}
