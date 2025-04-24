package com.server.RealestateApiServer.Entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Agent {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String password;
    private String phone;
    
    @OneToMany(mappedBy = "agent", cascade = CascadeType.ALL)
    private List<Property> properties;
    
	
}
