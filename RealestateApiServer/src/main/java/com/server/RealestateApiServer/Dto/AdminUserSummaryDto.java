package com.server.RealestateApiServer.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminUserSummaryDto {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private long listingCount;
    private long ownedPropertyCount;
}
