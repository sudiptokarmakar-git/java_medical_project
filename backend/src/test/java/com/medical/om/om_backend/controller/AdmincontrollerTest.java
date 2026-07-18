package com.medical.om.om_backend.controller;

import com.medical.om.om_backend.entity.Inventory;
import com.medical.om.om_backend.entity.Medicine;
import com.medical.om.om_backend.entity.Suppliers;
import com.medical.om.om_backend.repository.InventoryRepository;
import com.medical.om.om_backend.repository.MedicineRepository;
import com.medical.om.om_backend.repository.SupplierRepository;
import com.medical.om.om_backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdmincontrollerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private MedicineRepository medicineRepository;

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private SupplierRepository supplierRepository;

    @InjectMocks
    private Admincontroller admincontroller;

    @Test
    void getStats_shouldReturnDashboardMetrics() {
        when(userRepository.count()).thenReturn(4L);
        when(medicineRepository.count()).thenReturn(12L);
        when(inventoryRepository.count()).thenReturn(8L);
        when(supplierRepository.count()).thenReturn(3L);

        Medicine medicine = new Medicine();
        medicine.setId(1L);
        medicine.setName("Paracetamol");
        medicine.setBatch("B001");
        medicine.setManufacturing_date(LocalDate.of(2025, 1, 10));
        medicine.setExpiration_date(LocalDate.of(2026, 1, 10));
        medicine.setCategory("Pain Relief");

        Inventory inventory = new Inventory();
        inventory.setId(1L);
        inventory.setMedicine_name("Paracetamol");
        inventory.setBatch("B001");
        inventory.setAvailable_qty(10);
        inventory.setSupplier("Med Supply");

        Suppliers supplier = new Suppliers();
        supplier.setId(1L);
        supplier.setName("Med Supply");
        supplier.setAddress("Nairobi");
        supplier.setJoinedfrom(LocalDate.of(2024, 1, 5));
        supplier.setContact(254700000);
        supplier.setEmail("sales@medsupply.com");

        when(medicineRepository.findTop5ByOrderByIdDesc()).thenReturn(List.of(medicine));
        when(inventoryRepository.findTop5ByOrderByIdDesc()).thenReturn(List.of(inventory));
        when(supplierRepository.findTop5ByOrderByIdDesc()).thenReturn(List.of(supplier));

        ResponseEntity<?> response = admincontroller.getStats();
        Map<String, Object> body = (Map<String, Object>) response.getBody();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(4L, body.get("totalUsers"));
        assertEquals(12L, body.get("totalMedicines"));
        assertEquals(8L, body.get("totalInventoryItems"));
        assertEquals(3L, body.get("totalSuppliers"));
        assertEquals(1, ((List<?>) body.get("recentMedicines")).size());
        assertEquals(1, ((List<?>) body.get("recentInventoryItems")).size());
        assertEquals(1, ((List<?>) body.get("recentSuppliers")).size());
    }
}
