package com.basic.elepent.Filter;


import com.basic.elepent.entity.FarmerEntity;
import com.basic.elepent.service.JWTservise;
import com.basic.elepent.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.stream.Collectors;


@Component
public class JWTFilter  extends OncePerRequestFilter {

    private  final JWTservise jwtservise;
    private final UserService userService;

    public JWTFilter(JWTservise jwtservise, UserService userService) {
        this.jwtservise = jwtservise;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authorization   = request.getHeader("Authorization");

        if(authorization == null){
            filterChain.doFilter(request,response);
            return;
        }
        if(!authorization.startsWith("Bearer ")){
            filterChain.doFilter(request,response);
        }

        String token = authorization.split("Bearer ")[1];
        if(token == null){
            filterChain.doFilter(request,response);
            return;
        }
        if(SecurityContextHolder.getContext().getAuthentication() != null){
            filterChain.doFilter(request,response);
            return;
        }


        String username = jwtservise.GetUsername(token);
        if(username == null){
            filterChain.doFilter(request,response);
            return;
        }
        System.out.println("token has been recived");

        if(SecurityContextHolder.getContext().getAuthentication() != null){
            filterChain.doFilter(request,response);
            return;
        }

        FarmerEntity farmer =  userService.findFarmerByUsername(username);

        UserDetails user = User.builder()
                .username(farmer.getFullname())
                .password(farmer.getPassword())
                .authorities( new SimpleGrantedAuthority(farmer.getRole())
                )
                .build();


        UsernamePasswordAuthenticationToken newtoken = new UsernamePasswordAuthenticationToken(user,null,user.getAuthorities());
        newtoken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(newtoken);
        filterChain.doFilter(request,response);
    }
}
