package com.smartguardian.app.controller;

import lombok.AllArgsConstructor;
import net.javaguides.todo.dto.JwtAuthResponse;
import net.javaguides.todo.dto.LoginDto;
import net.javaguides.todo.dto.RegisterDto;
import net.javaguides.todo.service.AuthService;
//import net.javaguides.todo.service.impl.RecaptchaService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
//    private RecaptchaService recaptchaService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto) {
        String response = authService.register(registerDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


    @PostMapping("/loginPage")
    public ResponseEntity<JwtAuthResponse> login(@RequestBody LoginDto loginDto) {
        // Log incoming request data for debugging
        System.out.println("Received login request for: " + loginDto.getUsernameOrEmail());
//        System.out.println("Captcha Token: " + loginDto.getCaptchaToken());

        // Verify the reCAPTCHA token
//        if (!recaptchaService.verify(loginDto.getCaptchaToken())) {
//            System.out.println("reCAPTCHA validation failed");
//            JwtAuthResponse errorResponse = new JwtAuthResponse();
//            return ResponseEntity.badRequest().body(errorResponse);
//        }

        // Attempt to login the user
        JwtAuthResponse jwtAuthResponse = authService.login(loginDto);
        if (jwtAuthResponse != null) {
            System.out.println("Login successful for user: " + loginDto.getUsernameOrEmail());
            return ResponseEntity.ok(jwtAuthResponse);
        } else {
            System.out.println("Login failed for user: " + loginDto.getUsernameOrEmail());
            JwtAuthResponse errorResponse = new JwtAuthResponse();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }




    @PostMapping("/oauth2/success")
    public ResponseEntity<JwtAuthResponse> oauth2Success(@RequestParam("token") String token) {
        // Send the token to the frontend after successful OAuth2 login
        JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
        jwtAuthResponse.setAccessToken(token); // This token could be the JWT created after successful OAuth2 login
        return new ResponseEntity<>(jwtAuthResponse, HttpStatus.OK);
    }

}
