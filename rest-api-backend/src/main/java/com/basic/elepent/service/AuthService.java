package com.basic.elepent.service;

import com.basic.elepent.dto.LoginReqestDTO;
import com.basic.elepent.dto.LoginRespontDTO;
import com.basic.elepent.dto.RegisterReqestDTO;
import com.basic.elepent.dto.RegisterRespondDTO;
import com.basic.elepent.entity.FarmerEntity;
import com.basic.elepent.repository.FarmerRepository;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;


@Service
public class AuthService {

    private final JWTservise jwtservise;
    private final FarmerRepository farmerRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public AuthService(JWTservise jwtservise, FarmerRepository farmerRepository, AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder) {
        this.jwtservise = jwtservise;
        this.farmerRepository = farmerRepository;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }


    public String getUserNameFromToken(String token) {
        String username= jwtservise.GetUsername(token);
        return  username;
    }




    public LoginRespontDTO createdToken(LoginReqestDTO loginReqestDTO) {
        if(!isExists(loginReqestDTO.getUsername())) {
            new LoginRespontDTO(null,null,true,"user not found",null,null);
        }
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginReqestDTO.getUsername(),loginReqestDTO.getPassword()));
        }catch (Exception e){
            new LoginRespontDTO(null,null,true,e.toString(),null,null);
        }

        FarmerEntity farmerEntity =  farmerRepository.findByUsername(loginReqestDTO.getUsername()).orElse(null);
        if(farmerEntity==null) {
            return new LoginRespontDTO(null,null,true,"farmer not found",null,null);
        }
        Map<String,Object> claims = new HashMap<String,Object>();
        claims.put("roles",farmerEntity.getRole());
        claims.put("emmail",farmerEntity.getId());

        String access_toke= jwtservise.createToken(farmerEntity.getUsername(),claims);

            return new LoginRespontDTO(farmerEntity.getId(),farmerEntity.getFullname(),false,null,access_toke, farmerEntity.getRole());




    }

    Boolean isExists( String username){
        return farmerRepository.findByUsername(username).isPresent();
    }


    public RegisterRespondDTO RegisterFarmer(RegisterReqestDTO registerReqestDTO) {
        if(farmerRepository.findByUsername(registerReqestDTO.getUsername()).isPresent()){
            return new RegisterRespondDTO(null, null, "username has been used",false );
        }

        FarmerEntity farmerEntity = new FarmerEntity(registerReqestDTO.getUsername(), passwordEncoder.encode(registerReqestDTO.getPassword()),
                registerReqestDTO.getEmail(), LocalDateTime.now(),
                registerReqestDTO.getFullname(), registerReqestDTO.getPhonemumber(),
                registerReqestDTO.getLocation(),  registerReqestDTO.getLanguage(),
                registerReqestDTO.getProvince(), registerReqestDTO.getDistrict(),
                registerReqestDTO.getVillage(), registerReqestDTO.getExactlocation(),
                registerReqestDTO.getCrops(), registerReqestDTO.getType(), registerReqestDTO.getRole());


        try {
            FarmerEntity faramer = farmerRepository.save(farmerEntity);
            if (faramer != null) {
                System.out.println("farmer notfount");
            }
            return new RegisterRespondDTO(faramer.getFullname(), faramer.getId(), "farmer is add",false );
        }
        catch (Exception e) {
            return new RegisterRespondDTO(null, null , e.toString(),true );
        }



    }
}
