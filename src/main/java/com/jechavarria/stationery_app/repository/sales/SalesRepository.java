package com.jechavarria.stationery_app.repository.sales;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jechavarria.stationery_app.models.entities.Sale;

public interface SalesRepository extends JpaRepository<Sale, Integer> {

    List<Sale> findBySaleDateBetween(LocalDate startDate, LocalDate endDate);

}
