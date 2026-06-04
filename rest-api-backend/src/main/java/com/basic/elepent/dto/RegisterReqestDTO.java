package com.basic.elepent.dto;


import com.basic.elepent.entity.FarmerEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;


@Data

public class RegisterReqestDTO extends UserDTO {


    private String language;
    private String province;
    private String district;
    private String  village;
    private String exactlocation;
    private List<String> crops;
    private String type;

    public RegisterReqestDTO(String username, String password, String email, LocalDateTime createddate,
                             String fullname, String phonemumber, String location, String language, String province,
                             String district, String village, String exactlocation, List<String> crops, String type) {
        super(username, password, email, createddate, fullname, phonemumber, location);
        this.language = language;
        this.province = province;
        this.district = district;
        this.village = village;
        this.exactlocation = exactlocation;
        this.crops = crops;
        this.type = type;
    }


}
