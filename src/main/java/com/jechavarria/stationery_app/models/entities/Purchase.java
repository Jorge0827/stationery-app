package com.jechavarria.stationery_app.models.entities;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Data;

@Data
@Entity
@Table(name = "Shopping")
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_purchase")
    private Integer id;

    @PastOrPresent
    @Column(name = "purchase_date", nullable = false)
    private LocalDate datePruchase;

    @Column(name = "total", nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @ManyToOne // Muchas Compras pueden referirse a un mismo proveedor
    @JoinColumn(name = "id_supplier", referencedColumnName = "id_supplier", nullable = false)
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "id_user", referencedColumnName = "id_user", nullable = false)
    private User user;

}
