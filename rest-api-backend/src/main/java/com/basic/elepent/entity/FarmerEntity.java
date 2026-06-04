package com.basic.elepent.entity;


import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

;import java.time.LocalDateTime;
import java.util.List;


@Document( collection =  "Farmer")


@Data

public class FarmerEntity extends UserEntitiy {




    private String language;
    private String province;
    private String district;
    private String  village;
    private String exactlocation;
    private List<String> crops;
    private String type;
    private  String role;


    public FarmerEntity( String username, String password, String email, LocalDateTime createddate, String fullname, String phonemumber, String location, String language, String province, String district, String village, String exactlocation, List<String> crops, String type, String role) {
        super( username, password, email, createddate, fullname, phonemumber, location);
        this.language = language;
        this.province = province;
        this.district = district;
        this.village = village;
        this.exactlocation = exactlocation;
        this.crops = crops;
        this.type = type;
        this.role = role;
    }
}
