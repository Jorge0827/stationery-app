package com.jechavarria.stationery_app.models.mappers;

import java.math.RoundingMode;

import org.springframework.stereotype.Component;

import com.jechavarria.stationery_app.models.dtos.dtoPurchases.PurchaseRequest;
import com.jechavarria.stationery_app.models.dtos.dtoPurchases.PurchaseResponse;



import com.jechavarria.stationery_app.models.entities.Purchase;
import com.jechavarria.stationery_app.models.entities.Supplier;
import com.jechavarria.stationery_app.models.entities.User;

@Component
public class PurchaseMapper {

    public PurchaseResponse toResponse(Purchase purchase){
        var response = new PurchaseResponse();
        response.setId(purchase.getId());
        response.setDate(purchase.getDatePruchase());
        response.setTotal(purchase.getTotal());
        response.setSupplier(purchase.getSupplier() != null ? purchase.getSupplier().getName() : null);
        response.setUser(purchase.getUser() != null ? purchase.getUser().getUserName() : null);
        return response;
    }

    public Purchase toEntity(PurchaseRequest purchaseRequest){
        var purchase = new Purchase();

        purchase.setDatePruchase(purchaseRequest.getDate());

        // total and FK ids are required (validated in DTO), so map directly
        purchase.setTotal(purchaseRequest.getTotal().setScale(2, RoundingMode.HALF_UP));

        var supplier = new Supplier();
        supplier.setId(purchaseRequest.getIdSupplier());
        purchase.setSupplier(supplier);

        var user = new User();
        user.setId(purchaseRequest.getIdUser());
        purchase.setUser(user);

        return purchase;
    }

}
