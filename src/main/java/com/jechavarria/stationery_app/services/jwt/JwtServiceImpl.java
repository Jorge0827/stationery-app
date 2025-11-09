package com.jechavarria.stationery_app.services.jwt;

import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.impl.lang.Function;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtServiceImpl implements JwtService{

    @Value("${jwt.expiration}")
    private Long expiration;

    @Value("${jwt.secret}")
    private String secret;

    @Override
    public String generateToken(UserDetails userDetails) {
        
        return generateToken(Map.of(), userDetails);
    }

    @Override
    public String generateToken(Map<String, Object> claims, UserDetails userDetails) {
        
        var secretKey = Keys.hmacShaKeyFor(secret.getBytes()); //Genere una llave usando el algoritmo SHA255
        return Jwts.builder()
            .claims(claims)
            .subject(userDetails.getUsername())
            .issuedAt(new Date(System.currentTimeMillis()))
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(secretKey, Jwts.SIG.HS256)
            .compact();
    }

    @Override
    public String extractUsername(String jwt) { //Para extraer el username necesito el token
        return extractClaim(jwt, Claims::getSubject);
        
    }

    @Override
    public String extractName(String token){
        return extractClaim(token, c -> c.get("name").toString());
    }

    @Override
    public String extractRole(String token){
        return extractClaim(token, c -> c.get("role").toString());
    }

    @Override
    public boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    @Override
    public boolean isTokenValid(String token, UserDetails userDetails){
        var username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver){

        var claims = extractAllClaims(token);

        return claimResolver.apply(claims);

    }
    private Date extractExpiration(String token) { //Para extraer el username necesito el token
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        var secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

    }

}
