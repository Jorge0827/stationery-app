package com.jechavarria.stationery_app.repository.purchases;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jechavarria.stationery_app.models.entities.Purchase;

public interface PurchaseRepository extends JpaRepository<Purchase, Integer> {

}
