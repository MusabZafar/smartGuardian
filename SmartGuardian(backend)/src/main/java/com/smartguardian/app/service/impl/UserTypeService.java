package com.smartguardian.app.service.impl;

import lombok.AllArgsConstructor;
import net.javaguides.todo.entity.UserType;
import net.javaguides.todo.repository.UserTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class UserTypeService {

    private final UserTypeRepository userTypeRepository;

    public List<UserType> getAllUserTypes() {
        return userTypeRepository.findAll();
    }

    public UserType createUserType(UserType userType) {
        return userTypeRepository.save(userType);
    }

    public UserType getUserTypeById(Long id) {
        return userTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserType not found"));
    }

    public void deleteUserType(Long id) {
        userTypeRepository.deleteById(id);
    }
}
