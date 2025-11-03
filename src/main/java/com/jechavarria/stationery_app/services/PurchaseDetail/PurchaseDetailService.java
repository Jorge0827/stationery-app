package com.jechavarria.stationery_app.services.PurchaseDetail;

import java.util.List;

import com.jechavarria.stationery_app.models.dtos.dtoPurchaseDetail.PurchaseDetailRequest;
import com.jechavarria.stationery_app.models.dtos.dtoPurchaseDetail.PurchaseDetailResponse;

public interface PurchaseDetailService {

    List<PurchaseDetailResponse> getAllDetails();

    PurchaseDetailResponse create(PurchaseDetailRequest data);

    PurchaseDetailResponse update(Integer idPurchase, String IdProduct, PurchaseDetailRequest data);

    PurchaseDetailResponse delete(Integer idPurchase, String idProduct);

}
