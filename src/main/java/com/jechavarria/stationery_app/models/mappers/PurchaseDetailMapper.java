package com.jechavarria.stationery_app.models.mappers;

import org.springframework.stereotype.Component;

import com.jechavarria.stationery_app.models.dtos.dtoPurchaseDetail.PurchaseDetailRequest;
import com.jechavarria.stationery_app.models.dtos.dtoPurchaseDetail.PurchaseDetailResponse;
import com.jechavarria.stationery_app.models.entities.Product;
import com.jechavarria.stationery_app.models.entities.Purchase;
import com.jechavarria.stationery_app.models.entities.PurchaseDetail;

@Component
public class PurchaseDetailMapper {

    public PurchaseDetailResponse toResponse(PurchaseDetail purchaseDetail){
        var response = new PurchaseDetailResponse();

        response.setIdPurchase(purchaseDetail.getPurchase().getId());
        response.setProduct(purchaseDetail.getProduct().getName());
        response.setQuantity(purchaseDetail.getQuantity());
        response.setUnitPrice(purchaseDetail.getUnitPrice());

        return response;
    }

    public PurchaseDetail toEntity(PurchaseDetailRequest purchaseDetailRequest){

        var entity = new PurchaseDetail();

        entity.setQuantity(purchaseDetailRequest.getQuantity());
        entity.setUnitPrice(purchaseDetailRequest.getUnitPrice());

        var purchase = new Purchase();
        entity.setPurchase(purchase);

        var product = new Product();
        entity.setProduct(product);

        return entity;
    }

}
