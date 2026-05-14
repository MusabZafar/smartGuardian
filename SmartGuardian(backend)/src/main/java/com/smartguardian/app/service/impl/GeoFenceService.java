package com.smartguardian.app.service.impl;


import net.javaguides.todo.dto.GeoFenceDTO;
import net.javaguides.todo.entity.GeoFence;
import net.javaguides.todo.repository.GeoFenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GeoFenceService {

    @Autowired
    private GeoFenceRepository geoFenceRepository;

    // Create a new GeoFence
    public GeoFence createGeoFence(GeoFenceDTO geoFenceDTO) {
        GeoFence geoFence = new GeoFence();
        geoFence.setName(geoFenceDTO.getName());
        geoFence.setDescription(geoFenceDTO.getDescription());
        geoFence.setSelectedUsers(geoFenceDTO.getSelectedUsers());
        geoFence.setSelectedGroups(geoFenceDTO.getSelectedGroups());
        geoFence.setPolygonCoordinates(geoFenceDTO.getPolygonCoordinates());
        geoFence.setPolygonColor(geoFenceDTO.getPolygonColor());

        return geoFenceRepository.save(geoFence);
    }

    // Delete a GeoFence
    public boolean deleteGeoFence(Long id) {
        Optional<GeoFence> geoFence = geoFenceRepository.findById(id);
        if (geoFence.isPresent()) {
            geoFenceRepository.delete(geoFence.get());
            return true;
        }
        return false;
    }

    // Get all GeoFences
    public List<GeoFence> getAllGeoFences() {
        return geoFenceRepository.findAll();
    }

    // Get a specific GeoFence by ID
    public Optional<GeoFence> getGeoFenceById(Long id) {
        return geoFenceRepository.findById(id);
    }


    // New method to update GeoFence
    public GeoFence updateGeoFence(Long id, GeoFenceDTO geoFenceDTO) {
        // Find the existing GeoFence
        GeoFence existingGeoFence = geoFenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("GeoFence not found with id: " + id));

        // Update fields
        existingGeoFence.setName(geoFenceDTO.getName());
        existingGeoFence.setDescription(geoFenceDTO.getDescription());
        existingGeoFence.setSelectedUsers(geoFenceDTO.getSelectedUsers());
        existingGeoFence.setSelectedGroups(geoFenceDTO.getSelectedGroups());
        existingGeoFence.setPolygonCoordinates(geoFenceDTO.getPolygonCoordinates());
        existingGeoFence.setPolygonColor(geoFenceDTO.getPolygonColor());

        // Save and return the updated GeoFence
        return geoFenceRepository.save(existingGeoFence);
    }
}

