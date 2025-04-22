package com.server.RealestateApiServer.Entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;


@Entity
public class Buyer {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String password;
    private String phone;
    
    @OneToMany(mappedBy = "buyer")
    private List<Property> purchasedProperties;
    
    @ManyToMany
    @JoinTable(
        name = "buyer_favorites",
        joinColumns = @JoinColumn(name = "buyer_id"),
        inverseJoinColumns = @JoinColumn(name = "property_id")
    )
    private List<Property> favoriteProperties;
    
    public List<Property> getFavoriteProperties() {
        return favoriteProperties;
    }

    public void setFavoriteProperties(List<Property> favoriteProperties) {
        this.favoriteProperties = favoriteProperties;
    }

    
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public Buyer() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Buyer(Long id, String name, String email, String password, String phone, List<Property> purchasedProperties,
			List<Property> favoriteProperties) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.password = password;
		this.phone = phone;
		this.purchasedProperties = purchasedProperties;
		this.favoriteProperties = favoriteProperties;
	}
}
