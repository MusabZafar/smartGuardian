package com.smartguardian.app.service.impl;

import lombok.AllArgsConstructor;
import net.javaguides.todo.dto.EmployeeResponseDto;
import net.javaguides.todo.dto.GroupRequestDto;
import net.javaguides.todo.dto.GroupResponseDto;
import net.javaguides.todo.entity.Employee;
import net.javaguides.todo.entity.Group;
import net.javaguides.todo.repository.EmployeeRepository;
import net.javaguides.todo.repository.GroupRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public GroupResponseDto createGroup(GroupRequestDto groupRequestDto) {
        // Check if the employee list is empty
        if (groupRequestDto.getEmployeeIds() == null || groupRequestDto.getEmployeeIds().isEmpty()) {
            throw new RuntimeException("Employee IDs must be provided.");
        }

        // Set the first employee as the owner by default (you can use any employee in the list as the owner)
        Long ownerId = groupRequestDto.getEmployeeIds().iterator().next();  // Get the first employee ID from the list

        // Fetch the owner Employee entity
        Employee owner = employeeRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        // Create and populate the Group entity
        Group group = new Group();
        group.setName(groupRequestDto.getName());
        group.setDescription(groupRequestDto.getDescription());
        group.setOwner(owner);  // Set the owner of the group

        // Fetch and add all employees to the group, including the owner
        Set<Employee> employees = groupRequestDto.getEmployeeIds().stream()
                .map(employeeId -> employeeRepository.findById(employeeId)
                        .orElseThrow(() -> new RuntimeException("Employee not found")))
                .collect(Collectors.toSet());
        group.setEmployees(employees);

        Group savedGroup = groupRepository.save(group);
        return mapToResponseDto(savedGroup);
    }

    public GroupResponseDto getGroupById(Long id) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        return mapToResponseDto(group);
    }

    public Set<GroupResponseDto> getAllGroups() {
        return groupRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toSet());
    }

    public GroupResponseDto updateGroup(Long id, GroupRequestDto groupRequestDto) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // Set the first employee in employeeIds as the owner
        Long ownerId = groupRequestDto.getEmployeeIds().iterator().next();
        Employee owner = employeeRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        group.setName(groupRequestDto.getName());
        group.setDescription(groupRequestDto.getDescription());
        group.setOwner(owner);

        // Update employees in the group
        Set<Employee> employees = groupRequestDto.getEmployeeIds().stream()
                .map(employeeId -> employeeRepository.findById(employeeId)
                        .orElseThrow(() -> new RuntimeException("Employee not found")))
                .collect(Collectors.toSet());
        group.setEmployees(employees);

        Group updatedGroup = groupRepository.save(group);
        return mapToResponseDto(updatedGroup);
    }

    public void deleteGroup(Long id) {
        groupRepository.deleteById(id);
    }

    private GroupResponseDto mapToResponseDto(Group group) {
        return new GroupResponseDto(
                group.getId(),
                group.getName(),
                group.getDescription(),
                mapToEmployeeDto(group.getOwner()),
                group.getEmployees().stream().map(this::mapToEmployeeDto).collect(Collectors.toSet())
        );
    }

    private EmployeeResponseDto mapToEmployeeDto(Employee employee) {
        return new EmployeeResponseDto(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getPhoneNumber(),
                employee.getUsername(),
                employee.getUserType().getTypeName()
        );
    }
}
