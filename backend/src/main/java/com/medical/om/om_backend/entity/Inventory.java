package com.medical.om.om_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "Inventory")
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "medicine_id",nullable = false)
    private Medicine medicine;

    @Column(nullable = false)
    private String batch;

    @Column(nullable = false)
    private int available_qty;

    @Column(nullable = false)
    private String supplier;

}
