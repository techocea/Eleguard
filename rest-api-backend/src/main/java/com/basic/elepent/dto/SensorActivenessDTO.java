package com.basic.elepent.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SensorActivenessDTO {
    private String sensorId;
    private String farmername;
   private Boolean active;
}
