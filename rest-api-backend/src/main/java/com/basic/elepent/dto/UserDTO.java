package com.basic.elepent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
;

import java.time.LocalDateTime;



@Data
public class UserDTO {
    private String username;
    private String password;
    private String email;
    private LocalDateTime createddate;
    private String fullname;
    private String phonemumber;
    private String location;

    public UserDTO(String username, String password, String email, LocalDateTime createddate, String fullname, String phonemumber, String location) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.createddate = createddate;
        this.fullname = fullname;
        this.phonemumber = phonemumber;
        this.location = location;
    }

    private  String role="USER";
}
