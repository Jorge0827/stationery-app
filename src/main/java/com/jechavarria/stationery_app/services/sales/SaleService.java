package com.jechavarria.stationery_app.services.sales;

import java.time.LocalDate;
import java.util.List;

import com.jechavarria.stationery_app.models.dtos.dtoSales.SalesRequest;
import com.jechavarria.stationery_app.models.dtos.dtoSales.SalesResponse;
import com.jechavarria.stationery_app.models.dtos.dtoSales.TopProductResponse;

public interface SaleService {

    List<SalesResponse> getAll();

    SalesResponse create(SalesRequest data);

    SalesResponse update(Integer id, SalesRequest data);

    SalesResponse delete(Integer id);

    List<SalesResponse> getByDateRange(LocalDate startDate, LocalDate endDate);

    List<SalesResponse> getByMonth(Integer year, Integer month);

    List<TopProductResponse> getTopProducts(LocalDate startDate, LocalDate endDate, Integer limit);



}
