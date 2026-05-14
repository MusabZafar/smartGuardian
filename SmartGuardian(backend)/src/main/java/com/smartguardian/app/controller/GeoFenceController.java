package com.smartguardian.app.controller;


import net.javaguides.todo.dto.GeoFenceDTO;
import net.javaguides.todo.entity.GeoFence;
import net.javaguides.todo.service.impl.GeoFenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/geofences")
public class GeoFenceController {

    @Autowired
    private GeoFenceService geoFenceService;

    // Create a new GeoFence
    @PostMapping
    public ResponseEntity<GeoFence> createGeoFence(@RequestBody GeoFenceDTO geoFenceDTO) {
        GeoFence createdGeoFence = geoFenceService.createGeoFence(geoFenceDTO);
        return new ResponseEntity<>(createdGeoFence, HttpStatus.CREATED);
    }

    // Delete a GeoFence
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGeoFence(@PathVariable Long id) {
        boolean isDeleted = geoFenceService.deleteGeoFence(id);
        if (isDeleted) {
            return ResponseEntity.ok("GeoFence deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("GeoFence not found");
        }
    }

    // Get all GeoFences
    @GetMapping
    public ResponseEntity<List<GeoFence>> getAllGeoFences() {
        List<GeoFence> geoFences = geoFenceService.getAllGeoFences();
        return new ResponseEntity<>(geoFences, HttpStatus.OK);
    }

    // Get a specific GeoFence by ID
    @GetMapping("/{id}")
    public ResponseEntity<GeoFence> getGeoFenceById(@PathVariable Long id) {
        Optional<GeoFence> geoFence = geoFenceService.getGeoFenceById(id);
        if (geoFence.isPresent()) {
            return ResponseEntity.ok(geoFence.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    // New method to update a GeoFence
    @PutMapping("/{id}")
    public ResponseEntity<GeoFence> updateGeoFence(
            @PathVariable Long id,
            @RequestBody GeoFenceDTO geoFenceDTO
    ) {
        GeoFence updatedGeoFence = geoFenceService.updateGeoFence(id, geoFenceDTO);
        return ResponseEntity.ok(updatedGeoFence);
    }
}

