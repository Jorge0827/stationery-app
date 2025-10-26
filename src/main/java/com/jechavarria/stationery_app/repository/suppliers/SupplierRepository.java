package com.jechavarria.stationery_app.repository.suppliers;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jechavarria.stationery_app.models.entities.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {

    Optional<Supplier> findByEmail(String email);

    Optional<Supplier> findByNit(String nit);
}
