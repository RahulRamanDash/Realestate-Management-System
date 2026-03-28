package com.server.RealestateApiServer.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminPropertySummaryDto {
    private String id;
    private String title;
    private String city;
    private String state;
    private String type;
    private double price;
    private boolean available;
    private String agentId;
    private String buyerId;
    private int imageCount;
}
