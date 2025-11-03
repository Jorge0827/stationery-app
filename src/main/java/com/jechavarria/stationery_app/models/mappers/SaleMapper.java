package com.jechavarria.stationery_app.models.mappers;

import org.springframework.stereotype.Component;

import com.jechavarria.stationery_app.models.dtos.dtoSales.SalesRequest;
import com.jechavarria.stationery_app.models.dtos.dtoSales.SalesResponse;
import com.jechavarria.stationery_app.models.entities.Sale;
import com.jechavarria.stationery_app.models.entities.User;

@Component
public class SaleMapper {

    public SalesResponse toResponse(Sale sale){

        var response = new SalesResponse();

        response.setId(sale.getId());
        response.setSalesDate(sale.getSaleDate());
        response.setTotal(sale.getTotal());
        response.setUser(sale.getUser().getUserName());

        return response;
    }

    public Sale toEntity(SalesRequest saleEntity){

        var entity = new Sale();

        entity.setSaleDate(saleEntity.getSalesDate());
        entity.setTotal(saleEntity.getTotal());
        
        var user = new User();
        user.setId(saleEntity.getUser());

        return entity;
    }

}
