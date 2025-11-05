package com.server.RealestateApiServer.Dto;

import com.server.RealestateApiServer.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private String userId;
    private String name;
    private String email;
    private String role;

    public AuthResponse(String accessToken, String refreshToken, User u) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.userId = u.getId();
        this.name = u.getName();
        this.email = u.getEmail();
        this.role = u.getRole();
    }
}
