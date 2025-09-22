package com.server.RealestateApiServer.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "properties")
public class Property {
    @Id
    private String id;
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
    private String buyerId;  // Optional: if bought
}