package com.jechavarria.stationery_app.services.saleDetail;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jechavarria.stationery_app.exceptions.IdNotFoundException;
import com.jechavarria.stationery_app.models.dtos.dtoSaleDetail.SaleDetailId;
import com.jechavarria.stationery_app.models.dtos.dtoSaleDetail.SaleDetailRequest;
import com.jechavarria.stationery_app.models.dtos.dtoSaleDetail.SaleDetailResponse;
import com.jechavarria.stationery_app.models.mappers.SaleDetailMapper;
import com.jechavarria.stationery_app.repository.products.ProductRepository;
import com.jechavarria.stationery_app.repository.saleDetail.SaleDetailRepository;
import com.jechavarria.stationery_app.repository.sales.SalesRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SaleDetailServiceImpl implements SaleDetailService {

    private final SaleDetailRepository saleDetailRepository;
    private final SaleDetailMapper saleDetailMapper;
    private final SalesRepository saleRepository;
    private final ProductRepository productRepository;

    public SaleDetailServiceImpl(SaleDetailRepository saleDetailRepository, SaleDetailMapper saleDetailMapper,
            SalesRepository saleRepository, ProductRepository productRepository) {
        this.saleDetailRepository = saleDetailRepository;
        this.saleDetailMapper = saleDetailMapper;
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<SaleDetailResponse> getAllSales() {
        log.info("Consultando los detalles de ventas en la base de datos");

        try {
            var details = saleDetailRepository.findAll().stream()
                    .map(saleDetailMapper::toResponse)
                    .toList();

            return details;

        } catch (Exception e) {
            log.error("Ocurrió un error al consultar los detalles de las ventas: {}", e.getMessage());
            throw new RuntimeException("Error interno al obtener información sobre los detalles de las ventas");
        }
    }

    @Override
    public SaleDetailResponse create(SaleDetailRequest data) {
        log.info("Verificando existencia de la venta para crear detalle de la misma");
        var existingId = saleRepository.findById(data.getIdSale())
                .orElseThrow(() -> new IdNotFoundException("La venta con id " + data.getIdSale() + " No existe"));
    
        log.info("Verificando existencia de producto para crear detalle de compra");
        var existingProduct = productRepository.findById(data.getIdProduct())
                .orElseThrow(() -> new IdNotFoundException("El producto con id " + data.getIdProduct() + " No existe"));

        var newSaleDetail = saleDetailMapper.toEntity(data);

        newSaleDetail.setProduct(existingProduct);
        newSaleDetail.setSale(existingId);

        var saved = saleDetailRepository.save(newSaleDetail);

        return saleDetailMapper.toResponse(saved);
    }

    @Override
    public SaleDetailResponse update(Integer idSale, String idProduct, SaleDetailRequest data) {
        
        var id = new SaleDetailId(idSale, idProduct);

        var existingDetail = saleDetailRepository.findById(id)
                .orElseThrow(() -> new IdNotFoundException("Detalle de compra no encotrada"));

        existingDetail.setQuantity(data.getQuantity());
        existingDetail.setUnitPrice(data.getUnitPrice());

        var detailUpdate = saleDetailRepository.save(existingDetail);

        return saleDetailMapper.toResponse(detailUpdate);
    }

    @Override
    public SaleDetailResponse delete(Integer idSale, String idProduct) {
        
        var id = new SaleDetailId(idSale, idProduct);

        var existingDetail = saleDetailRepository.findById(id)
                .orElseThrow(() -> new IdNotFoundException("Detalle de venta no encontrado"));
        
        saleDetailRepository.delete(existingDetail);

        return saleDetailMapper.toResponse(existingDetail);
    }

}
