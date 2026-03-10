package com.jechavarria.stationery_app.repository.products;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jechavarria.stationery_app.models.entities.Product;

public interface ProductRepository extends JpaRepository<Product, String> {

    List<Product> findByCurrentStockLessThanEqualOrderByCurrentStockAsc(Integer currentStock);

    List<Product> findAllByOrderByCurrentStockAsc();

}
