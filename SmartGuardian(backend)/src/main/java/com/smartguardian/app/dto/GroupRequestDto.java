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
public class GroupRequestDto {
    private String name;
    private String description;
    private Set<Long> employeeIds; // List of Employee IDs, including the intended owner as the first element
}
