package com.server.RealestateApiServer.Service;

import com.server.RealestateApiServer.Dto.AdminDashboardSummaryDto;
import com.server.RealestateApiServer.Dto.AdminPropertySummaryDto;
import com.server.RealestateApiServer.Dto.AdminUserSummaryDto;
import com.server.RealestateApiServer.Entity.Property;
import com.server.RealestateApiServer.Entity.User;
import java.util.List;

public interface AdminService {
    AdminDashboardSummaryDto getDashboardSummary();
    List<AdminUserSummaryDto> getUsers(String role, String search);
    User getUserById(String userId);
    User updateUserRole(String userId, String role, String currentAdminEmail);
    List<AdminPropertySummaryDto> getProperties(String city, String type, String availability, String agentId, String buyerId, String search);
    Property getPropertyById(String propertyId);
    Property reassignProperty(String propertyId, String agentId);
}
