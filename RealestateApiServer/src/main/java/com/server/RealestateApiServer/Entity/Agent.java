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
@Entity
@AllArgsConstructor
@NoArgsConstructor
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
    
//	public Long getId() {
//		return id;
//	}
//	public void setId(Long id) {
//		this.id = id;
//	}
//	public String getName() {
//		return name;
//	}
//	public void setName(String name) {
//		this.name = name;
//	}
//	public String getEmail() {
//		return email;
//	}
//	public void setEmail(String email) {
//		this.email = email;
//	}
//	public String getPassword() {
//		return password;
//	}
//	public void setPassword(String password) {
//		this.password = password;
//	}
//	public String getPhone() {
//		return phone;
//	}
//	public void setPhone(String phone) {
//		this.phone = phone;
//	}
//	public Agent() {
//		super();
//		// TODO Auto-generated constructor stub
//	}
//	public Agent(Long id, String name, String email, String password, String phone, List<Property> properties) {
//		super();
//		this.id = id;
//		this.name = name;
//		this.email = email;
//		this.password = password;
//		this.phone = phone;
//		this.properties = properties;
//	}
}
