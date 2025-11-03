package com.jechavarria.stationery_app.services.sales;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jechavarria.stationery_app.exceptions.IdNotFoundException;
import com.jechavarria.stationery_app.models.dtos.dtoSales.SalesRequest;
import com.jechavarria.stationery_app.models.dtos.dtoSales.SalesResponse;
import com.jechavarria.stationery_app.models.mappers.SaleMapper;
import com.jechavarria.stationery_app.repository.sales.SalesRepository;
import com.jechavarria.stationery_app.repository.users.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class SaleServiceImpl implements SaleService {

    private final SalesRepository salesRepository;
    private final SaleMapper saleMapper;
    private final UserRepository userRepository;

    public SaleServiceImpl(SalesRepository salesRepository, SaleMapper saleMapper, UserRepository userRepository) {
        this.salesRepository = salesRepository;
        this.saleMapper = saleMapper;
        this.userRepository = userRepository;
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
            throw new RuntimeException("Error interno al obtener información sobre las compras");
        }

    }

    @Override
    public SalesResponse create(SalesRequest data) {

        // Verificar existencia del ID
        log.info("Verificando existencia de Usuario");
        var existingUser = userRepository.findById(data.getUser())
                .orElseThrow(() -> new IdNotFoundException("Usuario no encontrado" + data.getUser()));

        // Mappear
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

        // Verificar existencia del ID dle usuario
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
        log.info("Verificando existencia de id para modificar venta");
        var existingId = salesRepository.findById(id)
                .orElseThrow(() -> new IdNotFoundException("La venta con id " + id + " No existe"));

        salesRepository.delete(existingId);
        return saleMapper.toResponse(existingId);

    }

}
