package com.jechavarria.stationery_app.services.saleDetail;

import java.util.List;

import com.jechavarria.stationery_app.models.dtos.dtoSaleDetail.SaleDetailRequest;
import com.jechavarria.stationery_app.models.dtos.dtoSaleDetail.SaleDetailResponse;

public interface SaleDetailService {

    List<SaleDetailResponse> getAllSales();

    List<SaleDetailResponse> getDetailsBySaleId(Integer saleId);

    SaleDetailResponse create(SaleDetailRequest data);

    SaleDetailResponse update(Integer idSale, String idProduct, SaleDetailRequest data);

    SaleDetailResponse delete(Integer idSale, String idProduct);

}
