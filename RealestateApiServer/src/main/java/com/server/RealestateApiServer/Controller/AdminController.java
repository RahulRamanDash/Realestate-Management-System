package com.server.RealestateApiServer.Controller;

import com.server.RealestateApiServer.Dto.AdminDashboardSummaryDto;
import com.server.RealestateApiServer.Dto.AdminPropertyReassignRequest;
import com.server.RealestateApiServer.Dto.AdminPropertySummaryDto;
import com.server.RealestateApiServer.Dto.AdminUserRoleUpdateRequest;
import com.server.RealestateApiServer.Dto.AdminUserSummaryDto;
import com.server.RealestateApiServer.Entity.Property;
import com.server.RealestateApiServer.Entity.User;
import com.server.RealestateApiServer.Service.AdminService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/summary")
    public ResponseEntity<AdminDashboardSummaryDto> getSummary() {
        return ResponseEntity.ok(adminService.getDashboardSummary());
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserSummaryDto>> getUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(adminService.getUsers(role, search));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable String id,
            @Valid @RequestBody AdminUserRoleUpdateRequest request,
            Principal principal
    ) {
        return ResponseEntity.ok(adminService.updateUserRole(id, request.getRole(), principal.getName()));
    }

    @GetMapping("/properties")
    public ResponseEntity<List<AdminPropertySummaryDto>> getProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String availability,
            @RequestParam(required = false) String agentId,
            @RequestParam(required = false) String buyerId,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(adminService.getProperties(city, type, availability, agentId, buyerId, search));
    }

    @GetMapping("/properties/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable String id) {
        return ResponseEntity.ok(adminService.getPropertyById(id));
    }

    @PatchMapping("/properties/{id}/reassign-agent")
    public ResponseEntity<Property> reassignProperty(
            @PathVariable String id,
            @Valid @RequestBody AdminPropertyReassignRequest request
    ) {
        return ResponseEntity.ok(adminService.reassignProperty(id, request.getAgentId()));
    }
}
