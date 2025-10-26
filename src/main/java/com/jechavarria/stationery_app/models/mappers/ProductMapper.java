package com.jechavarria.stationery_app.models.mappers;

import org.springframework.stereotype.Component;

import com.jechavarria.stationery_app.models.dtos.dtoProducts.ProductRequest;
import com.jechavarria.stationery_app.models.dtos.dtoProducts.ProductResponse;
import com.jechavarria.stationery_app.models.entities.Product;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product){
        var response = new ProductResponse();

        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setUnitPrice(product.getUnitPrice());
        response.setCurrentStock(product.getCurrentStock());

        return response;
    }

    public Product toEntity(ProductRequest request){
        var entity = new Product();
        
        entity.setId(request.getId());
        entity.setName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setUnitPrice(request.getUnitPrice());
        entity.setCurrentStock(request.getCurrentStock());

        return entity;
    }

}
