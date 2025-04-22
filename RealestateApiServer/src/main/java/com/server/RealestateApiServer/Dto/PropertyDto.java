package com.server.RealestateApiServer.Dto;

public class PropertyDto {
	private Long id;
	private String title;
	private String description;
	private String address;
	private String city;
	private String state;
	private double price;
	private String type;
	private boolean available;
	private Long agentId;
	private Long buyerId;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
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
	public Long getAgentId() {
		return agentId;
	}
	public void setAgentId(Long agentId) {
		this.agentId = agentId;
	}
	public Long getBuyerId() {
		return buyerId;
	}
	public void setBuyerId(Long buyerId) {
		this.buyerId = buyerId;
	}
	public PropertyDto(Long id, String title, String description, String address, String city, String state,
			double price, String type, boolean available, Long agentId, Long buyerId) {
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
		this.agentId = agentId;
		this.buyerId = buyerId;
	}
	public PropertyDto() {
		super();
		// TODO Auto-generated constructor stub
	}
}
