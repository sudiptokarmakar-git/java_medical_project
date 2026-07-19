package com.medical.om.om_backend.Dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class SalesPurchaseDto {
    private Long medicineId;
    private int quantity;
    private double amount;
    private LocalDate date;
    private String type; // "SALE" or "PURCHASE"
}
