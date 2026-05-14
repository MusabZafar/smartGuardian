package com.smartguardian.app.controller;

import lombok.AllArgsConstructor;
import net.javaguides.todo.service.impl.AuthServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class PasswordController {

    private final AuthServiceImpl authService;

    // Step 1: Send OTP for password reset
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam("email") String email) {
        boolean otpSent = authService.sendOtpForPasswordReset(email);
        if (!otpSent) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email not found.");
        }
        return ResponseEntity.ok("OTP has been sent to your email.");
    }

    // Step 2: Verify the OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam("email") String email, @RequestParam("otp") String otp) {
        boolean isOtpValid = authService.verifyOtp(email, otp);
        if (!isOtpValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP.");
        }
        return ResponseEntity.ok("OTP verified. You can now reset your password.");
    }

    // Step 3: Reset the password
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam("email") String email, @RequestParam("newPassword") String newPassword) {
        boolean resetStatus = authService.resetPasswordByEmail(email, newPassword);
        if (resetStatus) {
            return ResponseEntity.ok("Password has been successfully reset.");
        } else {
            return ResponseEntity.badRequest().body("Something went wrong while resetting the password.");
        }
    }
}
