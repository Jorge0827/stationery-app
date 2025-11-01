package com.jechavarria.stationery_app.services.Purchases;

import java.util.List;

import com.jechavarria.stationery_app.models.dtos.dtoPurchases.PurchaseRequest;
import com.jechavarria.stationery_app.models.dtos.dtoPurchases.PurchaseResponse;

public interface PurchaseService {

    List<PurchaseResponse> getAll();
    
    PurchaseResponse create(PurchaseRequest data);

    PurchaseResponse update(Integer id, PurchaseRequest data);

    PurchaseResponse delete(Integer id);


}
