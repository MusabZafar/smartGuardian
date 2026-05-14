package com.smartguardian.app.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import net.javaguides.todo.entity.Role;
import net.javaguides.todo.entity.User;
import net.javaguides.todo.repository.RoleRepository;
import net.javaguides.todo.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Component
@AllArgsConstructor
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private UserRepository userRepository;
    private RoleRepository roleRepository;

    @PersistenceContext
    private EntityManager entityManager;  // Inject the EntityManager here




    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // Cast authentication to OAuth2AuthenticationToken to get provider details
        OAuth2AuthenticationToken oAuth2Token = (OAuth2AuthenticationToken) authentication;

        // Get provider information (e.g., Google, GitHub, Facebook)
        String provider = oAuth2Token.getAuthorizedClientRegistrationId();
        OAuth2User oAuth2User = oAuth2Token.getPrincipal();
        String email = oAuth2User.getAttribute("email");  // Retrieve email

        // Try to get the user's email and name from OAuth2 attributes
        String name = oAuth2User.getAttribute("name");

        if (email == null || email.isEmpty()) {
            Object oauth2Id = oAuth2User.getAttribute("id");
            if (oauth2Id instanceof Integer) {
                email = "github_user_" + oauth2Id.toString() + "@github.com";  // Handle Integer ID
            } else if (oauth2Id instanceof String) {
                email = "github_user_" + (String) oauth2Id + "@github.com";  // Handle String ID
            } else {
                email = "github_user_unknown@github.com";  // Fallback in case of unexpected type
            }
        }

        // Handle missing or split name
        String firstName = "";
        String lastName = "";
        if (name != null && !name.isEmpty()) {
            String[] nameParts = name.split(" ");
            firstName = nameParts[0];
            if (nameParts.length > 1) {
                lastName = nameParts[1];
            } else {
                lastName = "Unknown";
            }
        } else {
            firstName = "OAuth2";
            lastName = "User";  // Fallback if name is not provided
        }

        // Get provider ID and handle different types (Integer and String)
        Object providerIdObject = oAuth2User.getAttribute("id");
        String providerId = null;

        if (providerIdObject instanceof Integer) {
            providerId = ((Integer) providerIdObject).toString();  // Convert Integer to String
        } else if (providerIdObject instanceof String) {
            providerId = (String) providerIdObject;  // Already a String
        }

        // Check if user already exists by email
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            // User does not exist, create a new user
            user = new User();
            user.setUsername(name != null ? name : "OAuth2 User");
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setPassword("");  // No password for OAuth2 logins
            user.setProvider(provider);  // Set the provider (e.g., google, github)
            user.setProviderId(providerId);  // Set the provider-specific ID

            // Fetch ROLE_USER and assign it to the new user
            Role userRole = roleRepository.findByName("ROLE_USER");
            if (userRole == null) {
                throw new IllegalStateException("ROLE_USER not found in the database!");
            }

            // Merge the role to attach it within the transaction
            userRole = entityManager.merge(userRole);
            user.setRoles(Set.of(userRole));

            // Save the user to the database
            userRepository.save(user);
        }

        // Get the role of the user for the JWT token
        String role = user.getRoles().stream().findFirst().orElse(new Role()).getName();

        // Generate JWT token with email and role
        String token = jwtTokenProvider.generateToken(email, role);

        // Redirect to the frontend with the token
        String redirectUrl = "http://localhost:3000/OAuth2Redirect?token=" + token;
        response.sendRedirect(redirectUrl);
    }

}
