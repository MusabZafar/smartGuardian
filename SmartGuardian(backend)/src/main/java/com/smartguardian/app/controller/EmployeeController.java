package com.smartguardian.app.controller;

import lombok.AllArgsConstructor;
import net.javaguides.todo.dto.EmployeeRequestDto;
import net.javaguides.todo.dto.EmployeeResponseDto;
import net.javaguides.todo.service.impl.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@AllArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    // Create a new employee
    @PostMapping
    public ResponseEntity<EmployeeResponseDto> createEmployee(@RequestBody EmployeeRequestDto employeeRequestDto) {
        EmployeeResponseDto responseDto = employeeService.createEmployee(employeeRequestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    // Get an employee by ID
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponseDto> getEmployeeById(@PathVariable Long id) {
        EmployeeResponseDto responseDto = employeeService.getEmployeeById(id);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // Get all employees
    @GetMapping
    public ResponseEntity<List<EmployeeResponseDto>> getAllEmployees() {
        List<EmployeeResponseDto> employees = employeeService.getAllEmployees();
        return new ResponseEntity<>(employees, HttpStatus.OK);
    }

    // Update an employee by ID

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponseDto> updateEmployee(@PathVariable Long id, @RequestBody EmployeeRequestDto employeeRequestDto) {
        EmployeeResponseDto responseDto = employeeService.updateEmployee(id, employeeRequestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // Delete an employee by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
