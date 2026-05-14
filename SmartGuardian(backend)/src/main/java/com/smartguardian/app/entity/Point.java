package com.smartguardian.app.entity;



import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Embeddable  // This tells JPA that this is an embeddable object
public class Point {

    private double lat;  // Latitude of the point
    private double lng;  // Longitude of the point

    // Getters and Setters
}
