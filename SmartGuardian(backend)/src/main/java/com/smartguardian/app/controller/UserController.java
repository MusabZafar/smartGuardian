package com.smartguardian.app.controller;

import net.javaguides.todo.entity.User;
import net.javaguides.todo.repository.UserRepository;
import net.javaguides.todo.service.impl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // Endpoint to fetch user by email
    @GetMapping("/by-email")
    public ResponseEntity<User> getUserByEmail(@RequestParam String email) {
        Optional<User> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // Endpoint to fetch user by username
    @GetMapping("/by-username")
    public ResponseEntity<User> getUserByUsername(@RequestParam String username) {
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }

//    // New endpoint to update user's image URL
//    @PutMapping("/update-image")
//    public ResponseEntity<User> updateUserImageUrl(
//            @RequestParam String username,
//            @RequestParam String imageUrl) {
//        User updatedUser = userService.updateUserImageUrl(username, imageUrl);
//        return ResponseEntity.ok(updatedUser);
//    }




    @PutMapping("/update-image")
    public ResponseEntity<?> updateUserImageUrl(
            @RequestParam String username,
            @RequestParam String imageUrl) {
        try {
            User updatedUser = userService.updateUserImageUrl(username, imageUrl);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update user image: " + e.getMessage());
        }
    }
}