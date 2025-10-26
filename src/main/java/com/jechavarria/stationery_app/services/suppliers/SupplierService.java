package com.jechavarria.stationery_app.services.suppliers;

import java.util.List;

import com.jechavarria.stationery_app.models.dtos.dtoSuppliers.SupplierRequest;
import com.jechavarria.stationery_app.models.dtos.dtoSuppliers.SupplierResponse;

public interface SupplierService {

    List<SupplierResponse> getAll();

    SupplierResponse create(SupplierRequest request);

    SupplierResponse update(Integer id, SupplierRequest request);

    SupplierResponse delete(Integer id);

}
