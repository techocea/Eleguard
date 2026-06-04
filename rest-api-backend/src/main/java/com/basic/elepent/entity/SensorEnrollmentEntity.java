package com.basic.elepent.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDateTime;

@Document(collection = "sensorEnrollment")

@NoArgsConstructor
@Data
public class SensorEnrollmentEntity {
    @Id
    @Indexed(unique = true)
    private String id;
    private String farmername;
    private String sectionId;
    private int water_canal_present;
    private int forest_distance_m;
    private Instant enrollment_dateAndTime;
    private Boolean active;
    private String GPS_Location;

    public SensorEnrollmentEntity(String farmername, String sectionId, int water_canal_present, int forest_distance_m, Instant enrollment_dateAndTime, Boolean active, String GPS_Location) {
        this.farmername = farmername;
        this.sectionId = sectionId;
        this.water_canal_present = water_canal_present;
        this.forest_distance_m = forest_distance_m;
        this.enrollment_dateAndTime = enrollment_dateAndTime;
        this.active = active;
        this.GPS_Location = GPS_Location;
    }
}
