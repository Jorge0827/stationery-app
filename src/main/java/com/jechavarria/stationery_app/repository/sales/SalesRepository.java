package com.jechavarria.stationery_app.repository.sales;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jechavarria.stationery_app.models.entities.Sale;

public interface SalesRepository extends JpaRepository<Sale, Integer> {
    

}
