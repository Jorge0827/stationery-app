package com.jechavarria.stationery_app.services.Products;

import java.util.List;

import com.jechavarria.stationery_app.models.dtos.dtoProducts.ProductRequest;
import com.jechavarria.stationery_app.models.dtos.dtoProducts.ProductResponse;

public interface ProductService {

    List<ProductResponse> getAll();

    ProductResponse create(ProductRequest data);

    ProductResponse update(String id, ProductRequest data);

    void delete(String id);

    List<ProductResponse> getLowStock(Integer threshold);

    List<ProductResponse> getAllOrderByStockAsc();

}
