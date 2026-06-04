package com.basic.elepent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@AllArgsConstructor
@NoArgsConstructor
@Data
public class SensorRespondDTO {
    private String  Id;
    private String sectionId;
    private String massage;
    private Boolean error;



}
