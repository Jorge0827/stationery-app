package com.jechavarria.stationery_app.models.mappers;

import org.springframework.stereotype.Component;

import com.jechavarria.stationery_app.models.dtos.dtoSaleDetail.SaleDetailRequest;
import com.jechavarria.stationery_app.models.dtos.dtoSaleDetail.SaleDetailResponse;
import com.jechavarria.stationery_app.models.entities.Product;
import com.jechavarria.stationery_app.models.entities.Sale;
import com.jechavarria.stationery_app.models.entities.SaleDetail;

@Component
public class SaleDetailMapper {

    public SaleDetailResponse toResponse(SaleDetail saleDetail) {
        var response = new SaleDetailResponse();

        response.setIdSale(saleDetail.getSale().getId());
        response.setProduct(saleDetail.getProduct().getName());
        response.setQuantity(saleDetail.getQuantity());
        response.setUnitPrice(saleDetail.getUnitPrice());

        return response;
    }

    public SaleDetail toEntity(SaleDetailRequest saleDetailRequest) {

        var entity = new SaleDetail();

        entity.setQuantity(saleDetailRequest.getQuantity());
        entity.setUnitPrice(saleDetailRequest.getUnitPrice());

        var sale = new Sale();
        entity.setSale(sale);

        var product = new Product();
        entity.setProduct(product);

        return entity;
    }

}
