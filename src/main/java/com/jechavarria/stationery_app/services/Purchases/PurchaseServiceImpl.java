package com.jechavarria.stationery_app.services.Purchases;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jechavarria.stationery_app.exceptions.IdNotFoundException;
import com.jechavarria.stationery_app.models.dtos.dtoPurchases.PurchaseRequest;
import com.jechavarria.stationery_app.models.dtos.dtoPurchases.PurchaseResponse;
import com.jechavarria.stationery_app.models.mappers.PurchaseMapper;
import com.jechavarria.stationery_app.repository.purchases.PurchaseRepository;
import com.jechavarria.stationery_app.repository.suppliers.SupplierRepository;
import com.jechavarria.stationery_app.repository.users.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final PurchaseMapper purchaseMapper;

    private final SupplierRepository supplierRepository;

    private final UserRepository userRepository;

    public PurchaseServiceImpl(PurchaseRepository purchaseRepository, PurchaseMapper purchaseMapper,
            SupplierRepository supplierRepository, UserRepository userRepository) {
        this.purchaseRepository = purchaseRepository;
        this.purchaseMapper = purchaseMapper;
        this.supplierRepository = supplierRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<PurchaseResponse> getAll() {
        log.info("Consultando las compras en la BD");

        try {
            var purchases = purchaseRepository.findAll().stream()
                    .map(purchaseMapper::toResponse)
                    .toList();
            log.info("Compras encontradas exitosamente, Total {}.", purchases.size());
            return purchases;

        } catch (Exception e) {
            log.error("Ocurrió un error al consultar las compras: {}", e.getMessage());
            throw new RuntimeException("Error interno al obtener información sobre las compras");
        }
    }

    @Override
    public PurchaseResponse create(PurchaseRequest data) {
        // Verificar existencia de proveedor
        log.info("verificando exitencia de proveedor");
        var existingSupplier = supplierRepository.findById(data.getIdSupplier())
                .orElseThrow(() -> new IdNotFoundException("Proveedor no encontrado" + data.getIdSupplier()));

        // Verificar existencia del ID
        log.info("Verificando existencia de Usuario");
        var existingUser = userRepository.findById(data.getIdUser())
                .orElseThrow(() -> new IdNotFoundException("Usuario no encontrado" + data.getIdUser()));

        // Mappear
        var newPurchase = purchaseMapper.toEntity(data);

        newPurchase.setSupplier(existingSupplier);
        newPurchase.setUser(existingUser);

        var saved = purchaseRepository.save(newPurchase);

        return purchaseMapper.toResponse(saved);

    }

    @Override
    public PurchaseResponse update(Integer id, PurchaseRequest data) {
        log.info("Verificando existencia de id para modificar compra");
        var existingId = purchaseRepository.findById(id)
                .orElseThrow(() -> new IdNotFoundException("La compra con id " + id + " No existe"));

        // Verificar existencia de proveedor
        log.info("verificando exitencia de proveedor");
        var existingSupplier = supplierRepository.findById(data.getIdSupplier())
                .orElseThrow(() -> new IdNotFoundException("Proveedor no encontrado" + data.getIdSupplier()));

        // Verificar existencia del ID
        log.info("Verificando existencia de Usuario");
        var existingUser = userRepository.findById(data.getIdUser())
                .orElseThrow(() -> new IdNotFoundException("Usuario no encontrado" + data.getIdUser()));

        existingId.setDatePruchase(data.getDate());
        existingId.setTotal(data.getTotal());
        existingId.setSupplier(existingSupplier);
        existingId.setUser(existingUser);

        purchaseRepository.save(existingId);
        log.info("Compra modificada exitosamente");

        return purchaseMapper.toResponse(existingId);
    }

    @Override
    public PurchaseResponse delete(Integer id) {
        log.info("Verificando existencia de id para eliminar una compra");
        var existingId = purchaseRepository.findById(id)
                .orElseThrow(() -> new IdNotFoundException("La compra con id " + id + " No existe"));

        purchaseRepository.delete(existingId);
        return purchaseMapper.toResponse(existingId);

    }

}
