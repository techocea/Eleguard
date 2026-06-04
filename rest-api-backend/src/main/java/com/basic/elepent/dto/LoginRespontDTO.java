package com.basic.elepent.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LoginRespontDTO {

  private  String  id;
  private String  name;
  private  boolean  error;
  private  String massge;
  private  String access_token;
  private  String  role;


}
