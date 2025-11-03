package com.jechavarria.stationery_app.services.sales;

import java.util.List;

import com.jechavarria.stationery_app.models.dtos.dtoSales.SalesRequest;
import com.jechavarria.stationery_app.models.dtos.dtoSales.SalesResponse;

public interface SaleService {

    List<SalesResponse> getAll();

    SalesResponse create(SalesRequest data);

    SalesResponse update(Integer id, SalesRequest data);

    SalesResponse delete(Integer id);



}
