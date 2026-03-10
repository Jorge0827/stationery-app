package com.jechavarria.stationery_app.services.sales;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.jechavarria.stationery_app.exceptions.IdNotFoundException;
import com.jechavarria.stationery_app.models.dtos.dtoSales.SalesRequest;
import com.jechavarria.stationery_app.models.dtos.dtoSales.SalesResponse;
import com.jechavarria.stationery_app.models.dtos.dtoSales.TopProductResponse;
import com.jechavarria.stationery_app.models.mappers.SaleMapper;
import com.jechavarria.stationery_app.repository.saleDetail.SaleDetailRepository;
import com.jechavarria.stationery_app.repository.saleDetail.SaleDetailRepository.TopProductProjection;
import com.jechavarria.stationery_app.repository.sales.SalesRepository;
import com.jechavarria.stationery_app.repository.users.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class SaleServiceImpl implements SaleService {

    private final SalesRepository salesRepository;
    private final SaleMapper saleMapper;
    private final UserRepository userRepository;
    private final SaleDetailRepository saleDetailRepository;

    public SaleServiceImpl(
            SalesRepository salesRepository,
            SaleMapper saleMapper,
            UserRepository userRepository,
            SaleDetailRepository saleDetailRepository) {
        this.salesRepository = salesRepository;
        this.saleMapper = saleMapper;
        this.userRepository = userRepository;
        this.saleDetailRepository = saleDetailRepository;
    }

    @Override
    public List<SalesResponse> getAll() {

        log.info("Consultando las ventas en la BD");

        try {
            var sales = salesRepository.findAll().stream()
                    .map(saleMapper::toResponse)
                    .toList();

            log.info("Ventas encontradas exitosamente, Total {}.", sales.size());
            return sales;

        } catch (Exception e) {
            log.error("Ocurrió un error al consultar las ventas: {} ", e.getMessage());
            throw new RuntimeException("Error interno al obtener información sobre las ventas");
        }

    }

    @Override
    public SalesResponse create(SalesRequest data) {

        log.info("Verificando existencia de Usuario");
        var existingUser = userRepository.findById(data.getUser())
                .orElseThrow(() -> new IdNotFoundException("Usuario no encontrado" + data.getUser()));

        var newSale = saleMapper.toEntity(data);

        newSale.setUser(existingUser);

        var saved = salesRepository.save(newSale);

        return saleMapper.toResponse(saved);

    }

    @Override
    public SalesResponse update(Integer id, SalesRequest data) {
        log.info("Verificando existencia de id para modificar venta");
        var existingId = salesRepository.findById(id)
                .orElseThrow(() -> new IdNotFoundException("La venta con id " + id + " No existe"));

        log.info("Verificando existencia de Usuario");
        var existingUser = userRepository.findById(data.getUser())
                .orElseThrow(() -> new IdNotFoundException("Usuario no encontrado" + data.getUser()));

        existingId.setSaleDate(data.getSalesDate());
        existingId.setTotal(data.getTotal());
        existingId.setUser(existingUser);

        salesRepository.save(existingId);
        log.info("Venta modificada exitosamente");

        return saleMapper.toResponse(existingId);
    }

    @Override
    public SalesResponse delete(Integer id) {
        log.info("Verificando existencia de id para eliminar venta");
        var existingId = salesRepository.findById(id)
                .orElseThrow(() -> new IdNotFoundException("La venta con id " + id + " No existe"));

        salesRepository.delete(existingId);
        return saleMapper.toResponse(existingId);

    }

    @Override
    public List<SalesResponse> getByDateRange(LocalDate startDate, LocalDate endDate) {
        log.info("Consultando ventas entre {} y {}", startDate, endDate);
        var sales = salesRepository.findBySaleDateBetween(startDate, endDate).stream()
                .map(saleMapper::toResponse)
                .toList();
        log.info("Ventas encontradas en rango: {}", sales.size());
        return sales;
    }

    @Override
    public List<SalesResponse> getByMonth(Integer year, Integer month) {
        var startDate = LocalDate.of(year, month, 1);
        var endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        return getByDateRange(startDate, endDate);
    }

    @Override
    public List<TopProductResponse> getTopProducts(LocalDate startDate, LocalDate endDate, Integer limit) {
        var pageRequest = PageRequest.of(0, limit != null && limit > 0 ? limit : 5);

        log.info("Consultando productos más vendidos entre {} y {} (límite {})", startDate, endDate, pageRequest.getPageSize());

        List<TopProductProjection> results = saleDetailRepository.findTopProductsBetweenDates(startDate, endDate,
                pageRequest);

        return results.stream()
                .map(r -> new TopProductResponse(
                        r.getProductId(),
                        r.getProductName(),
                        r.getTotalQuantity(),
                        r.getTotalAmount()))
                .toList();
    }

}
