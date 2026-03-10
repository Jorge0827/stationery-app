package com.jechavarria.stationery_app.repository.purchases;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jechavarria.stationery_app.models.entities.Purchase;

public interface PurchaseRepository extends JpaRepository<Purchase, Integer> {

    List<Purchase> findByDatePruchaseBetween(LocalDate startDate, LocalDate endDate);

    List<Purchase> findBySupplierId(Integer supplierId);

}
