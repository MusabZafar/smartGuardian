package com.smartguardian.app.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt-secret}")
    private String jwtSecret;

    @Value("${app.jwt-expiration-milliseconds}")
    private long jwtExpirationDate;

    // Original method for backward compatibility
    public String generateToken(String username) {
        return generateToken(username, null, null); // Call the new method with null values
    }

    // Method with username and role
    public String generateToken(String username, String role) {
        return generateToken(username, role, null); // Call the new method with null user ID
    }

    // Enhanced method with username, role, and user ID
    public String generateToken(String username, String role, Long userId) {
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + jwtExpirationDate);

        JwtBuilder builder = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(key());

        // Add the username as a claim
        builder.claim("username", username);

        // If role is provided, add it as a claim
        if (role != null) {
            builder.claim("role", role);
        }

        // If user ID is provided, add it as a claim
        if (userId != null) {
            builder.claim("userId", userId);
        }

        return builder.compact();
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getUsernameFromJWT(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Log the claims to see what's in the token
            System.out.println("JWT Claims: " + claims);

            // Retrieve the username from claims (can use getSubject if set as subject)
            String username = claims.getSubject();
            System.out.println("Extracted Username: " + username);
            return username;
        } catch (Exception e) {
            // Log the exception if there's an issue with parsing the token
            System.out.println("Error while extracting username: " + e.getMessage());
            return null;
        }
    }

    // New method to extract user ID from JWT
    public Long getUserIdFromJWT(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Retrieve the user ID from claims
            Object userIdClaim = claims.get("userId");
            if (userIdClaim != null) {
                // Handle both Integer and Long types
                if (userIdClaim instanceof Integer) {
                    return ((Integer) userIdClaim).longValue();
                } else if (userIdClaim instanceof Long) {
                    return (Long) userIdClaim;
                }
            }
            System.out.println("Extracted User ID: " + userIdClaim);
            return userIdClaim != null ? Long.valueOf(userIdClaim.toString()) : null;
        } catch (Exception e) {
            System.out.println("Error while extracting user ID: " + e.getMessage());
            return null;
        }
    }

    // New method to extract role from JWT
    public String getRoleFromJWT(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Retrieve the role from claims
            String role = (String) claims.get("role");
            System.out.println("Extracted Role: " + role);
            return role;
        } catch (Exception e) {
            System.out.println("Error while extracting role: " + e.getMessage());
            return null;
        }
    }

    // Method to extract all claims from JWT
    public Claims getAllClaimsFromJWT(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            System.out.println("All JWT Claims: " + claims);
            return claims;
        } catch (Exception e) {
            System.out.println("Error while extracting claims: " + e.getMessage());
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(key()).build().parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException | ExpiredJwtException | UnsupportedJwtException | IllegalArgumentException ex) {
            // You could log the exception here or return more specific messages for debugging
            return false;
        }
    }
}
