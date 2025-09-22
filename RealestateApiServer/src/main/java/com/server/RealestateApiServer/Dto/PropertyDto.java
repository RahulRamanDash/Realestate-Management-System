package com.server.RealestateApiServer.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyDto {
    private String id;  // MongoDB ObjectId stored as String

    private String title;
    private String description;
    private String address;
    private String city;
    private String state;
    private double price;
    private String type; // e.g., Apartment, House
    private boolean available;
    private List<String> imageUrls;

    private String agentId;  // Reference to Agent
    private String buyerId;
}
