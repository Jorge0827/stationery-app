package com.jechavarria.stationery_app.services.PurchaseDetail;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jechavarria.stationery_app.exceptions.IdNotFoundException;
import com.jechavarria.stationery_app.models.dtos.dtoPurchaseDetail.PurchaseDetailId;
import com.jechavarria.stationery_app.models.dtos.dtoPurchaseDetail.PurchaseDetailRequest;
import com.jechavarria.stationery_app.models.dtos.dtoPurchaseDetail.PurchaseDetailResponse;
import com.jechavarria.stationery_app.models.mappers.PurchaseDetailMapper;
import com.jechavarria.stationery_app.repository.products.ProductRepository;
import com.jechavarria.stationery_app.repository.purchaseDetail.PurchaseDetailRepository;
import com.jechavarria.stationery_app.repository.purchases.PurchaseRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PurchaseDetailServiceImpl implements PurchaseDetailService {

    private final PurchaseDetailRepository purchaseDetailRepository;
    private final PurchaseDetailMapper purchaseDetailMapper;
    private final PurchaseRepository purchaseRepository;
    private final ProductRepository productRepository;

    public PurchaseDetailServiceImpl(PurchaseDetailRepository purchaseDetailRepository,
            PurchaseDetailMapper purchaseDetailMapper, PurchaseRepository purchaseRepository,
            ProductRepository productRepository) {
        this.purchaseDetailRepository = purchaseDetailRepository;
        this.purchaseDetailMapper = purchaseDetailMapper;
        this.purchaseRepository = purchaseRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<PurchaseDetailResponse> getAllDetails() {
        log.info("Consultando los detalles de compras en la base de datos");

        try {
            var details = purchaseDetailRepository.findAll().stream()
                    .map(purchaseDetailMapper::toResponse)
                    .toList();

            return details;

        } catch (Exception e) {
            log.error("Ocurrió un error al consultar las compras: {}", e.getMessage());
            throw new RuntimeException("Error interno al obtener información sobre las compras");
        }

    }

    @Override
    public List<PurchaseDetailResponse> getDetailsByPurchaseId(Integer purchaseId) {
        log.info("Consultando detalles de la compra #{}", purchaseId);
        return purchaseDetailRepository.findByPurchaseId(purchaseId).stream()
                .map(purchaseDetailMapper::toResponse)
                .toList();
    }

    @Override
    public PurchaseDetailResponse create(PurchaseDetailRequest data) {
        
        log.info("Verificando existencia de compra para crear detalle de compra");
        var existingId = purchaseRepository.findById(data.getIdpurchase())
                .orElseThrow(() -> new IdNotFoundException("La compra con id " + data.getIdpurchase() + " No existe"));
    
        log.info("Verificando existencia de producto para crear detalle de compra");
        var existingProduct = productRepository.findById(data.getIdproduct())
                .orElseThrow(() -> new IdNotFoundException("El producto con id " + data.getIdproduct() + " No existe"));

        var newPurchaseDetail = purchaseDetailMapper.toEntity(data);

        newPurchaseDetail.setProduct(existingProduct);
        newPurchaseDetail.setPurchase(existingId);

        var saved = purchaseDetailRepository.save(newPurchaseDetail);

        return purchaseDetailMapper.toResponse(saved);
    }

    @Override
    public PurchaseDetailResponse update(Integer idPurchase, String idProduct, PurchaseDetailRequest data) {

        var id = new PurchaseDetailId(idPurchase, idProduct);

        var existingDetail = purchaseDetailRepository.findById(id)
                .orElseThrow(() -> new IdNotFoundException("Detalle de compra no encotrada"));

        existingDetail.setQuantity(data.getQuantity());
        existingDetail.setUnitPrice(data.getUnitPrice());

        var detailUpdate = purchaseDetailRepository.save(existingDetail);

        return purchaseDetailMapper.toResponse(detailUpdate);

    }

    @Override
    public PurchaseDetailResponse delete(Integer idPurchase, String idProduct) {
        
        var id = new PurchaseDetailId(idPurchase, idProduct);

        var existingDetail = purchaseDetailRepository.findById(id)
                .orElseThrow(() -> new IdNotFoundException("Detalle de compra no encotrada"));
        
        purchaseDetailRepository.delete(existingDetail);

        return purchaseDetailMapper.toResponse(existingDetail);
    }
}
