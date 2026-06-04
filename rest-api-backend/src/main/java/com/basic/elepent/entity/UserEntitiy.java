package com.basic.elepent.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data

public class UserEntitiy {
    @Id
    @Indexed(unique = true)
    private String id;
    private String username;
    private String password;
    private String email;
    private LocalDateTime createddate;
    private String fullname;
    private String phonemumber;

    public UserEntitiy(String username, String password, String email, LocalDateTime createddate, String fullname, String phonemumber, String location) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.createddate = createddate;
        this.fullname = fullname;
        this.phonemumber = phonemumber;
        this.location = location;
    }

    private String location;
}
