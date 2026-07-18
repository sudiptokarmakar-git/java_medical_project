package com.medical.om.om_backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

import com.medical.om.om_backend.Dto.InventoryDto;
import com.medical.om.om_backend.Dto.MedicineDto;
import com.medical.om.om_backend.Dto.SupplierDto;
import com.medical.om.om_backend.Dto.UserDto;
import com.medical.om.om_backend.Dto.SalesPurchaseDto;
import com.medical.om.om_backend.entity.Inventory;
import com.medical.om.om_backend.entity.Medicine;
import com.medical.om.om_backend.entity.Suppliers;
import com.medical.om.om_backend.entity.Users;
import com.medical.om.om_backend.entity.SalesPurchase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.medical.om.om_backend.repository.InventoryRepository;
import com.medical.om.om_backend.repository.MedicineRepository;
import com.medical.om.om_backend.repository.SupplierRepository;
import com.medical.om.om_backend.repository.UserRepository;
import com.medical.om.om_backend.repository.SalesPurchaseRepository;

@RestController
@RequestMapping("/api/admin")
public class Admincontroller {
    private final UserRepository userRepository;
    private final MedicineRepository medicineRepository;
    private final InventoryRepository inventoryRepository;
    private final SupplierRepository supplierRepository;
    private final SalesPurchaseRepository salesPurchaseRepository;
    private final PasswordEncoder passwordEncoder;

    public Admincontroller(UserRepository userRepository,
                           MedicineRepository medicineRepository,
                           InventoryRepository inventoryRepository,
                           SupplierRepository supplierRepository,
                           SalesPurchaseRepository salesPurchaseRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.medicineRepository = medicineRepository;
        this.inventoryRepository = inventoryRepository;
        this.supplierRepository = supplierRepository;
        this.salesPurchaseRepository = salesPurchaseRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalMedicines", medicineRepository.count());
        stats.put("totalInventoryItems", inventoryRepository.count());
        stats.put("totalSuppliers", supplierRepository.count());
        stats.put("recentMedicines", medicineRepository.findTop5ByOrderByIdDesc());
        stats.put("recentInventoryItems", inventoryRepository.findTop5ByOrderByIdDesc());
        stats.put("recentSuppliers", supplierRepository.findTop5ByOrderByIdDesc());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Users>> getUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody UserDto request) {
        Users user = new Users();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDto request) {
        return userRepository.findById(id).map(user -> {
            user.setName(request.getName());
            user.setUsername(request.getUsername());
            if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            user.setRole(request.getRole());
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/medicines")
    public ResponseEntity<List<Medicine>> getMedicines() {
        return ResponseEntity.ok(medicineRepository.findAll());
    }

    @PostMapping("/medicines")
    public ResponseEntity<?> createMedicine(@RequestBody MedicineDto request) {
        Medicine medicine = new Medicine();
        medicine.setName(request.getName());
        medicine.setBatch(request.getBatch());
        medicine.setManufacturing_date(request.getManufacturing_date());
        medicine.setExpiration_date(request.getExpiration_date());
        medicine.setCategory(request.getCategory());
        return ResponseEntity.ok(medicineRepository.save(medicine));
    }

    @PutMapping("/medicines/{id}")
    public ResponseEntity<?> updateMedicine(@PathVariable Long id, @RequestBody MedicineDto request) {
        return medicineRepository.findById(id).map(medicine -> {
            medicine.setName(request.getName());
            medicine.setBatch(request.getBatch());
            medicine.setManufacturing_date(request.getManufacturing_date());
            medicine.setExpiration_date(request.getExpiration_date());
            medicine.setCategory(request.getCategory());
            return ResponseEntity.ok(medicineRepository.save(medicine));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id) {
        medicineRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/inventory")
    public ResponseEntity<List<Inventory>> getInventory() {
        return ResponseEntity.ok(inventoryRepository.findAll());
    }

    @PostMapping("/inventory")
    public ResponseEntity<?> createInventory(@RequestBody InventoryDto request) {
        Inventory inventory = new Inventory();
        inventory.setMedicine_name(request.getMedicine_name());
        inventory.setBatch(request.getBatch());
        inventory.setAvailable_qty(request.getAvailable_qty());
        inventory.setSupplier(request.getSupplier());
        return ResponseEntity.ok(inventoryRepository.save(inventory));
    }

    @PutMapping("/inventory/{id}")
    public ResponseEntity<?> updateInventory(@PathVariable Long id, @RequestBody InventoryDto request) {
        return inventoryRepository.findById(id).map(inventory -> {
            inventory.setMedicine_name(request.getMedicine_name());
            inventory.setBatch(request.getBatch());
            inventory.setAvailable_qty(request.getAvailable_qty());
            inventory.setSupplier(request.getSupplier());
            return ResponseEntity.ok(inventoryRepository.save(inventory));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/inventory/{id}")
    public ResponseEntity<?> deleteInventory(@PathVariable Long id) {
        inventoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/suppliers")
    public ResponseEntity<List<Suppliers>> getSuppliers() {
        return ResponseEntity.ok(supplierRepository.findAll());
    }

    @PostMapping("/suppliers")
    public ResponseEntity<?> createSupplier(@RequestBody SupplierDto request) {
        Suppliers supplier = new Suppliers();
        supplier.setName(request.getName());
        supplier.setAddress(request.getAddress());
        supplier.setJoinedfrom(request.getJoinedfrom());
        supplier.setContact(request.getContact());
        supplier.setEmail(request.getEmail());
        return ResponseEntity.ok(supplierRepository.save(supplier));
    }

    @PutMapping("/suppliers/{id}")
    public ResponseEntity<?> updateSupplier(@PathVariable Long id, @RequestBody SupplierDto request) {
        return supplierRepository.findById(id).map(supplier -> {
            supplier.setName(request.getName());
            supplier.setAddress(request.getAddress());
            supplier.setJoinedfrom(request.getJoinedfrom());
            supplier.setContact(request.getContact());
            supplier.setEmail(request.getEmail());
            return ResponseEntity.ok(supplierRepository.save(supplier));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/suppliers/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable Long id) {
        supplierRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Sales and Purchases CRUD
    @GetMapping("/sales")
    public ResponseEntity<List<SalesPurchase>> getSalesPurchases() {
        return ResponseEntity.ok(salesPurchaseRepository.findAll());
    }

    @PostMapping("/sales")
    public ResponseEntity<?> createSalesPurchase(@RequestBody SalesPurchaseDto request) {
        SalesPurchase record = new SalesPurchase();
        record.setMedicineName(request.getMedicineName());
        record.setQuantity(request.getQuantity());
        record.setAmount(request.getAmount());
        record.setDate(request.getDate());
        record.setType(request.getType());
        return ResponseEntity.ok(salesPurchaseRepository.save(record));
    }

    @PutMapping("/sales/{id}")
    public ResponseEntity<?> updateSalesPurchase(@PathVariable Long id, @RequestBody SalesPurchaseDto request) {
        return salesPurchaseRepository.findById(id).map(record -> {
            record.setMedicineName(request.getMedicineName());
            record.setQuantity(request.getQuantity());
            record.setAmount(request.getAmount());
            record.setDate(request.getDate());
            record.setType(request.getType());
            return ResponseEntity.ok(salesPurchaseRepository.save(record));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/sales/{id}")
    public ResponseEntity<?> deleteSalesPurchase(@PathVariable Long id) {
        salesPurchaseRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
