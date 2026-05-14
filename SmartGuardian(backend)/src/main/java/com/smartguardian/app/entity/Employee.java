package com.smartguardian.app.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    private String phoneNumber;
    private String username;
    private Date birthDate;
    private Date hireDate;
    private Date terminationDate;
    private Double annualSalary;
    private String additionalInfo;

    @ManyToOne
    @JoinColumn(name = "user_type_id", nullable = false)
    @JsonBackReference // Prevents recursion in serialization
    private UserType userType;
}
