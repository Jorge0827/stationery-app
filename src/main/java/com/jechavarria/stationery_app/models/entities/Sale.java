package com.jechavarria.stationery_app.models.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Sales")
public class Sale {

    @Id
    @GeneratedValue(strategy =GenerationType.IDENTITY)
    @Column(name = "id_sale")
    private Integer id;

    @PastOrPresent
    @Column(name = "sale_date", nullable = false)
    private LocalDate saleDate;

    @Column(name = "total", nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @ManyToOne
    @JoinColumn(name = "id_user", referencedColumnName = "id_user", nullable = false)
    private User user;

    @Column(name = "notes", length = 500)
    private String notes;

    @OneToMany(mappedBy = "sale")
    private List<SaleDetail> saleDetails;

}
