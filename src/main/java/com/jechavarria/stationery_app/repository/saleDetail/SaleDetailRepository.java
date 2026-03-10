package com.jechavarria.stationery_app.repository.saleDetail;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jechavarria.stationery_app.models.dtos.dtoSaleDetail.SaleDetailId;
import com.jechavarria.stationery_app.models.entities.SaleDetail;

public interface SaleDetailRepository extends JpaRepository<SaleDetail, SaleDetailId> {

    List<SaleDetail> findBySaleId(Integer saleId);

    interface TopProductProjection {
        String getProductId();

        String getProductName();

        Long getTotalQuantity();

        BigDecimal getTotalAmount();
    }

    @Query("""
            SELECT d.product.id AS productId,
                   d.product.name AS productName,
                   SUM(d.quantity) AS totalQuantity,
                   SUM(d.quantity * d.unitPrice) AS totalAmount
            FROM SaleDetail d
            WHERE d.sale.saleDate BETWEEN :startDate AND :endDate
            GROUP BY d.product.id, d.product.name
            ORDER BY totalQuantity DESC
            """)
    List<TopProductProjection> findTopProductsBetweenDates(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

}
