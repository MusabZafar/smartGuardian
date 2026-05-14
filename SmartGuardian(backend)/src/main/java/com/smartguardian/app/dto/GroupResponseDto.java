package com.smartguardian.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupResponseDto {
    private Long id;
    private String name;
    private String description;
    private EmployeeResponseDto owner; // Owner details as an employee DTO
    private Set<EmployeeResponseDto> employees; // List of employees in the group
}
