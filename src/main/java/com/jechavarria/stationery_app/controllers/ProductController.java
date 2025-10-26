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

import com.jechavarria.stationery_app.models.dtos.dtoProducts.ProductRequest;
import com.jechavarria.stationery_app.models.dtos.dtoProducts.ProductResponse;
import com.jechavarria.stationery_app.services.Products.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private ProductService productService;

    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAll() {
        var products = productService.getAll();
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(@RequestBody ProductRequest data) {
        var newProduct = productService.create(data);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(newProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable String id, @RequestBody ProductRequest data) {
        var updateProduct = productService.update(id, data);
        
        return ResponseEntity.ok(updateProduct);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable String id){
        productService.delete(id);
    }
    
    

}
