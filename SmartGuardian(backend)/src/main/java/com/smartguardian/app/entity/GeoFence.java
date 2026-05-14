package com.smartguardian.app.entity;



import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class GeoFence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @ElementCollection
    private List<String> selectedUsers; // List of user IDs (Could be UUIDs or other identifiers)

    @ElementCollection
    private List<String> selectedGroups; // List of group IDs (Could be UUIDs or other identifiers)

    @ElementCollection
    private List<String> polygonCoordinates; // Storing as a list of coordinates (lat, lng)

    private String polygonColor;

    // Getters and Setters
}

