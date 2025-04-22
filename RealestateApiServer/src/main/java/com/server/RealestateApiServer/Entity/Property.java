package com.server.RealestateApiServer.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Property {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	private String title;
    private String description;
    private String address;
    private String city;
    private String state;
    private double price;
    private String type; // e.g., Apartment, House
    private boolean available;
    
    @ManyToOne
    @JoinColumn(name = "agent_id")
    private Agent agent;
    
    @ManyToOne
    @JoinColumn(name = "buyer_id")
    private Buyer buyer;

    
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public double getPrice() {
		return price;
	}
	public void setPrice(double price) {
		this.price = price;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public boolean isAvailable() {
		return available;
	}
	public void setAvailable(boolean available) {
		this.available = available;
	}
	
	
	public Agent getAgent() {
		return agent;
	}
	public void setAgent(Agent agent) {
		this.agent = agent;
	}
	
	public Buyer getBuyer() {
		return buyer;
	}
	public void setBuyer(Buyer buyer) {
		this.buyer = buyer;
	}
	public Property() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Property(long id, String title, String description, String address, String city, String state, double price,
			String type, boolean available, Agent agent, Buyer buyer) {
		super();
		this.id = id;
		this.title = title;
		this.description = description;
		this.address = address;
		this.city = city;
		this.state = state;
		this.price = price;
		this.type = type;
		this.available = available;
		this.agent = agent;
		this.buyer = buyer;
	}
}
