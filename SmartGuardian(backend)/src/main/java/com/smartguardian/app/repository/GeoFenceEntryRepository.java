package com.smartguardian.app.repository;

import net.javaguides.todo.entity.GeoFenceEntry;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.stereotype.Repository;

    @Repository
    public interface GeoFenceEntryRepository extends JpaRepository<GeoFenceEntry, Long> {
        // You can add custom query methods if needed
    }