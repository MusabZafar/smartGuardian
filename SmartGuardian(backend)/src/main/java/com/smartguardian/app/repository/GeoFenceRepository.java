package com.smartguardian.app.repository;




import net.javaguides.todo.entity.GeoFence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GeoFenceRepository extends JpaRepository<GeoFence, Long> {
    List<GeoFence> findAll();
    Optional<GeoFence> findById(Long id);
}
