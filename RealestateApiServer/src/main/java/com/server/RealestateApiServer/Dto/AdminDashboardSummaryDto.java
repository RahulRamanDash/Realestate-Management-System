package com.server.RealestateApiServer.Dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminDashboardSummaryDto {
    private long totalUsers;
    private long totalAgents;
    private long totalBuyers;
    private long totalAdmins;
    private long totalProperties;
    private long availableProperties;
    private long soldProperties;
    private List<AdminUserSummaryDto> recentUsers;
    private List<AdminPropertySummaryDto> recentProperties;
    private List<AdminPropertySummaryDto> recentSales;
}
