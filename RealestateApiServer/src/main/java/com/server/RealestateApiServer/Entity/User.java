package com.server.RealestateApiServer.Entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class Agent {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private String role;
}