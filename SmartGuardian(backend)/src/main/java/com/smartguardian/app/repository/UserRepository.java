package com.smartguardian.app.repository;

import net.javaguides.todo.entity.User;
    import org.springframework.data.jpa.repository.JpaRepository;

    import java.util.Optional;

    public interface UserRepository extends JpaRepository<User, Long> {
        Optional<User> findByUsernameOrEmail(String username, String email);
        Boolean existsByUsername(String username);
        Boolean existsByEmail(String email);
        // Method to find user by provider (e.g., Google, Facebook) and provider ID (unique identifier for OAuth)
        Optional<User> findByProviderAndProviderId(String provider, String providerId);
        Optional<User> findByEmail(String email);

        Optional<Object> findByUsername(String username);

    }


