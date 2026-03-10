package com.jechavarria.stationery_app.repository.purchaseDetail;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jechavarria.stationery_app.models.dtos.dtoPurchaseDetail.PurchaseDetailId;
import com.jechavarria.stationery_app.models.entities.PurchaseDetail;

public interface PurchaseDetailRepository extends JpaRepository<PurchaseDetail, PurchaseDetailId>  {

    List<PurchaseDetail> findByPurchaseId(Integer purchaseId);

}
