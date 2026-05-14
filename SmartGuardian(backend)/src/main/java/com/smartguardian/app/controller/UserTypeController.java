package com.smartguardian.app.controller;

import lombok.AllArgsConstructor;
import net.javaguides.todo.entity.UserType;
import net.javaguides.todo.service.impl.UserTypeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-types")
@AllArgsConstructor
public class UserTypeController {

    private final UserTypeService userTypeService;

    @GetMapping
    public ResponseEntity<List<UserType>> getAllUserTypes() {
        return new ResponseEntity<>(userTypeService.getAllUserTypes(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<UserType> createUserType(@RequestBody UserType userType) {
        return new ResponseEntity<>(userTypeService.createUserType(userType), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserType> getUserTypeById(@PathVariable Long id) {
        return new ResponseEntity<>(userTypeService.getUserTypeById(id), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserType(@PathVariable Long id) {
        userTypeService.deleteUserType(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
