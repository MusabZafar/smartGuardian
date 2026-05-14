package com.smartguardian.app.service.impl;

import lombok.AllArgsConstructor;
import net.javaguides.todo.dto.EmployeeRequestDto;
import net.javaguides.todo.dto.EmployeeResponseDto;
import net.javaguides.todo.entity.Employee;
import net.javaguides.todo.entity.UserType;
import net.javaguides.todo.repository.EmployeeRepository;
import net.javaguides.todo.repository.UserTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserTypeRepository userTypeRepository;

    public EmployeeResponseDto createEmployee(EmployeeRequestDto employeeRequestDto) {
        UserType userType = userTypeRepository.findById(employeeRequestDto.getUserTypeId())
                .orElseThrow(() -> new RuntimeException("UserType not found"));

        Employee employee = new Employee();
        setEmployeeData(employee, employeeRequestDto, userType);
        Employee savedEmployee = employeeRepository.save(employee);
        return mapToResponseDto(savedEmployee);
    }

    public EmployeeResponseDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return mapToResponseDto(employee);
    }

    public List<EmployeeResponseDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public EmployeeResponseDto updateEmployee(Long id, EmployeeRequestDto employeeRequestDto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        UserType userType = userTypeRepository.findById(employeeRequestDto.getUserTypeId())
                .orElseThrow(() -> new RuntimeException("UserType not found"));

        setEmployeeData(employee, employeeRequestDto, userType);
        Employee updatedEmployee = employeeRepository.save(employee);
        return mapToResponseDto(updatedEmployee);
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    private void setEmployeeData(Employee employee, EmployeeRequestDto dto, UserType userType) {
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setPhoneNumber(dto.getPhoneNumber());
        employee.setUsername(dto.getUsername());
        employee.setBirthDate(dto.getBirthDate());
        employee.setHireDate(dto.getHireDate());
        employee.setTerminationDate(dto.getTerminationDate());
        employee.setAnnualSalary(dto.getAnnualSalary());
        employee.setAdditionalInfo(dto.getAdditionalInfo());
        employee.setUserType(userType); // Set the UserType relationship
    }

    private EmployeeResponseDto mapToResponseDto(Employee employee) {
        return new EmployeeResponseDto(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getPhoneNumber(),
                employee.getUsername(),
                employee.getUserType().getTypeName() // Get the UserType name
        );
    }
}
