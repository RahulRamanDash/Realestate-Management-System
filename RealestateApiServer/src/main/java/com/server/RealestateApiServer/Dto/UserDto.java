package com.server.RealestateApiServer.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgentDto {
    private String id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private String role;
}
