package com.jechavarria.stationery_app.repository.saleDetail;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jechavarria.stationery_app.models.dtos.dtoSaleDetail.SaleDetailId;
import com.jechavarria.stationery_app.models.entities.SaleDetail;

public interface SaleDetailRepository extends JpaRepository<SaleDetail, SaleDetailId>  {

}
