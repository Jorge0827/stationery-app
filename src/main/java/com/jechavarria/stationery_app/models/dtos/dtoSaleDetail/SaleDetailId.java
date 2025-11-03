package com.jechavarria.stationery_app.models.dtos.dtoSaleDetail;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaleDetailId implements Serializable {

    // Must match the names of the entity's id properties when using @IdClass
    private Integer sale; // corresponds to Purchase.id
    private String product;   // corresponds to Product.id

}
