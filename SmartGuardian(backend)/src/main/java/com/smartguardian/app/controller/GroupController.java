package com.smartguardian.app.controller;

import lombok.AllArgsConstructor;
import net.javaguides.todo.dto.GroupRequestDto;
import net.javaguides.todo.dto.GroupResponseDto;
import net.javaguides.todo.service.impl.GroupService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/groups")
@AllArgsConstructor
public class GroupController {

    private final GroupService groupService;

    // Endpoint to create a new group
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<GroupResponseDto> createGroup(@RequestBody GroupRequestDto groupRequestDto) {
        GroupResponseDto group = groupService.createGroup(groupRequestDto);
        return new ResponseEntity<>(group, HttpStatus.CREATED);
    }

    // Endpoint to get a group by ID
    @GetMapping("/{id}")
    public ResponseEntity<GroupResponseDto> getGroupById(@PathVariable Long id) {
        GroupResponseDto group = groupService.getGroupById(id);
        return new ResponseEntity<>(group, HttpStatus.OK);
    }

    // Endpoint to get all groups
    @GetMapping
    public ResponseEntity<Set<GroupResponseDto>> getAllGroups() {
        Set<GroupResponseDto> groups = groupService.getAllGroups();
        return new ResponseEntity<>(groups, HttpStatus.OK);

    }

    // Endpoint to update a group by ID
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<GroupResponseDto> updateGroup(
            @PathVariable Long id, @RequestBody GroupRequestDto groupRequestDto) {
        GroupResponseDto group = groupService.updateGroup(id, groupRequestDto);
        return new ResponseEntity<>(group, HttpStatus.OK);
    }

    // Endpoint to delete a group by ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        groupService.deleteGroup(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
