package com.smartguardian.app.service.impl;

import lombok.AllArgsConstructor;
import com.smartguardian.app.dto.JwtAuthResponse;
import com.smartguardian.app.dto.LoginDto;
import com.smartguardian.app.dto.RegisterDto;
import com.smartguardian.app.entity.Role;
import com.smartguardian.app.entity.User;
import com.smartguardian.app.repository.RoleRepository;
import com.smartguardian.app.repository.UserRepository;
import net.javaguides.todo.security.JwtTokenProvider;
import com.smartguardian.app.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    private static final long OTP_VALID_DURATION = 5 * 60 * 1000; // OTP valid for 5 minutes

    @Override
    public String register(RegisterDto registerDto) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(registerDto.getUsername()) || userRepository.existsByEmail(registerDto.getEmail())) {
            throw new IllegalArgumentException("Username or email is already taken!");
        }

        // Check if passwords match
        if (!registerDto.getPassword().equals(registerDto.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match!");
        }

        // Create a new user
        User user = new User();
        user.setFirstName(registerDto.getFirstName());  // Set first name
        user.setLastName(registerDto.getLastName());    // Set last name
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));  // Hash password

        // Assign default role "ROLE_USER"
        Role userRole = roleRepository.findByName("ROLE_USER");
        if (userRole == null) {
            throw new IllegalStateException("ROLE_USER not found in the database!");
        }
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);

        userRepository.save(user);

        return "User registered successfully!";
    }

    @Override
    public JwtAuthResponse login(LoginDto loginDto) {
        User user = userRepository.findByUsernameOrEmail(loginDto.getUsernameOrEmail(), loginDto.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String role = user.getRoles().stream().findFirst().orElse(new Role()).getName();

        // Enhanced token generation with user ID
        String token = jwtTokenProvider.generateToken(user.getUsername(), role, user.getId());

        // Log the generated token details for debugging
        System.out.println("Generated token for user: " + user.getUsername() + " with ID: " + user.getId() + " and role: " + role);

        return new JwtAuthResponse(token, "Bearer", role); // Include role here
    }

    // Step 1: Check if the email exists in the database
    public boolean checkIfEmailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    // Step 2: Reset the password by email
    public boolean resetPasswordByEmail(String email, String newPassword) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    user.setPassword(passwordEncoder.encode(newPassword)); // Hash the password
                    userRepository.save(user);  // Save the updated user
                    return true;
                }).orElse(false);  // Email not found
    }

    // Step 1: Send OTP for password reset
    public boolean sendOtpForPasswordReset(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return false;
        }
        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiryTime(new Date(System.currentTimeMillis() + OTP_VALID_DURATION));
        userRepository.save(user);

        // Send OTP email
        sendOtpEmail(user.getEmail(), otp);
        return true;
    }

    // Step 2: Verify the OTP
    public boolean verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || user.getOtp() == null || user.getOtpExpiryTime() == null) {
            return false;
        }
        // Check if OTP is correct and not expired
        if (user.getOtp().equals(otp) && user.getOtpExpiryTime().after(new Date())) {
            // Clear OTP after successful verification
            user.setOtp(null);
            user.setOtpExpiryTime(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    // Helper method to generate OTP
    private String generateOtp() {
        Random random = new Random();
        int otpValue = 100000 + random.nextInt(900000);  // Generate a 6-digit OTP
        return String.valueOf(otpValue);
    }

    // Helper method to send OTP via email
    private void sendOtpEmail(String email, String otp) {
        String subject = "Password Reset OTP";
        String body = "Your OTP for password reset is " + otp + ". It is valid for 5 minutes.";
        emailService.sendEmail(email, subject, body);
    }
}
