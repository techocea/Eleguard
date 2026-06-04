package com.basic.elepent.Controller;

import com.basic.elepent.dto.LoginReqestDTO;
import com.basic.elepent.dto.LoginRespontDTO;
import com.basic.elepent.dto.RegisterReqestDTO;
import com.basic.elepent.dto.RegisterRespondDTO;
import com.basic.elepent.entity.FarmerEntity;
import com.basic.elepent.service.AdminService;
import com.basic.elepent.service.AuthService;
import com.basic.elepent.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1/auth")
public class AuthController {


    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }


    @GetMapping("/login")
    public LoginRespontDTO login(@RequestBody LoginReqestDTO loginReqestDTO) {

        FarmerEntity farmer = userService.findFarmerByUsername(loginReqestDTO.getUsername());
        if (farmer == null) {
             return  new LoginRespontDTO(null,null,true,"User not found",null,null);
        }

        return  authService.createdToken(loginReqestDTO);

    }





    @PostMapping("/register")
    public ResponseEntity<RegisterRespondDTO> register(@RequestBody RegisterReqestDTO registerReqestDTO) {

         RegisterRespondDTO respont =   authService.RegisterFarmer(registerReqestDTO);
         if(respont == null){
             return  new ResponseEntity<>(HttpStatus.BAD_REQUEST);
         }
         return new ResponseEntity<>(respont, HttpStatus.OK);

    }









}
