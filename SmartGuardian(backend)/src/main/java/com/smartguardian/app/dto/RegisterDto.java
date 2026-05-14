package com.smartguardian.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDto {
    private String firstName;        // New field
    private String lastName;         // New field
    private String username;
    private String email;
    private String password;
    private String confirmPassword;  // New field for password confirmation
}
