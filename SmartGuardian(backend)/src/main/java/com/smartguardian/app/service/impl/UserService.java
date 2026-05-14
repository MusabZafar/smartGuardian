package com.smartguardian.app.service.impl;

import net.javaguides.todo.entity.User;
import net.javaguides.todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }





    // New method to get user by username
    public User getUserByUsername(String username) {
        return (User) userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    // Method to update user's image URL
    public User updateUserImageUrl(String username, String imageUrl) {
        User user = getUserByUsername(username);
        user.setImageUrl(imageUrl);
        return userRepository.save(user);
    }
}