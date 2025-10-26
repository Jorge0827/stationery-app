package com.jechavarria.stationery_app.repository.products;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jechavarria.stationery_app.models.entities.Product;

public interface ProductRepository extends JpaRepository<Product, String> {

}
