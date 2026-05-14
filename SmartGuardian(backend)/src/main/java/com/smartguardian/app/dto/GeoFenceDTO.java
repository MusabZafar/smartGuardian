package com.smartguardian.app.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class GeoFenceDTO {
    private String name;
    private String description;
    private List<String> selectedUsers;
    private List<String> selectedGroups;
    private List<String> polygonCoordinates;
    private String polygonColor;

    // Getters and Setters
}

