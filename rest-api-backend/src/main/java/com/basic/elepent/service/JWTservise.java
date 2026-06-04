package com.basic.elepent.service;

import com.basic.elepent.entity.FarmerEntity;
import com.basic.elepent.repository.FarmerRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Service
public class JWTservise {

    private  final SecretKey secretKey;
    private final FarmerRepository farmerRepository;


    public JWTservise(FarmerRepository farmerRepository) {
        this.farmerRepository = farmerRepository;
        try{
            SecretKey k = KeyGenerator.getInstance("HmacSHA256").generateKey();
            this.secretKey = Keys.hmacShaKeyFor(k.getEncoded());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }



    public String createToken(String username,Map<String,Object> claims){

        FarmerEntity farmerEntity = farmerRepository.findByUsername(username).orElse(null);

        return Jwts.builder()
                .claims(claims)
                .subject(username)

                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 3600 * 1000))
                .signWith(secretKey)
                .compact();
    }


    public String GetUsername(String token){
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
        }catch (Exception e){
            return null;
        }

    }


}
