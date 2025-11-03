package com.jechavarria.stationery_app.models.dtos.dtoPurchaseDetail;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseDetailId implements Serializable {

    // Must match the names of the entity's id properties when using @IdClass
    private Integer purchase; // corresponds to Purchase.id
    private String product;   // corresponds to Product.id

}
