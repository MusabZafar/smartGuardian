package com.smartguardian.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequestDto {
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String username;
    private Date birthDate;
    private Date hireDate;
    private Date terminationDate;
    private Double annualSalary;
    private Long userTypeId; // ID of the user type
    private String additionalInfo;
}
