package com.server.RealestateApiServer.Service;

import com.server.RealestateApiServer.Dto.AdminDashboardSummaryDto;
import com.server.RealestateApiServer.Dto.AdminPropertySummaryDto;
import com.server.RealestateApiServer.Dto.AdminUserSummaryDto;
import com.server.RealestateApiServer.Entity.Property;
import com.server.RealestateApiServer.Entity.User;
import com.server.RealestateApiServer.Exception.ResourceNotFoundException;
import com.server.RealestateApiServer.Repository.PropertyRepository;
import com.server.RealestateApiServer.Repository.UserRepository;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final MongoTemplate mongoTemplate;

    @Override
    public AdminDashboardSummaryDto getDashboardSummary() {
        long totalUsers = userRepository.count();
        long totalAgents = userRepository.countByRole("ROLE_AGENT");
        long totalBuyers = userRepository.countByRole("ROLE_BUYER");
        long totalAdmins = userRepository.countByRole("ROLE_ADMIN");
        long totalProperties = propertyRepository.count();
        long availableProperties = propertyRepository.countByAvailableTrue();
        long soldProperties = totalProperties - availableProperties;

        Query latestUsersQuery = new Query().with(Sort.by(Sort.Direction.DESC, "_id")).limit(5);
        Query latestPropertiesQuery = new Query().with(Sort.by(Sort.Direction.DESC, "_id")).limit(5);
        Query latestSalesQuery = new Query()
                .addCriteria(new Criteria().orOperator(
                        Criteria.where("available").is(false),
                        Criteria.where("buyerId").ne(null).ne("")
                ))
                .with(Sort.by(Sort.Direction.DESC, "_id"))
                .limit(5);

        List<AdminUserSummaryDto> recentUsers = mongoTemplate.find(latestUsersQuery, User.class)
                .stream()
                .map(this::toUserSummary)
                .collect(Collectors.toList());
        List<AdminPropertySummaryDto> recentProperties = mongoTemplate.find(latestPropertiesQuery, Property.class)
                .stream()
                .map(this::toPropertySummary)
                .collect(Collectors.toList());
        List<AdminPropertySummaryDto> recentSales = mongoTemplate.find(latestSalesQuery, Property.class)
                .stream()
                .map(this::toPropertySummary)
                .collect(Collectors.toList());

        return new AdminDashboardSummaryDto(
                totalUsers,
                totalAgents,
                totalBuyers,
                totalAdmins,
                totalProperties,
                availableProperties,
                soldProperties,
                recentUsers,
                recentProperties,
                recentSales
        );
    }

    @Override
    public List<AdminUserSummaryDto> getUsers(String role, String search) {
        Query query = new Query();

        if (role != null && !role.isBlank()) {
            query.addCriteria(Criteria.where("role").is(role.trim().toUpperCase(Locale.ROOT)));
        }

        if (search != null && !search.isBlank()) {
            String pattern = search.trim();
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("name").regex(pattern, "i"),
                    Criteria.where("email").regex(pattern, "i"),
                    Criteria.where("phone").regex(pattern, "i")
            ));
        }

        query.with(Sort.by(Sort.Direction.ASC, "name"));

        return mongoTemplate.find(query, User.class)
                .stream()
                .map(this::toUserSummary)
                .collect(Collectors.toList());
    }

    @Override
    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    @Override
    public User updateUserRole(String userId, String role, String currentAdminEmail) {
        User user = getUserById(userId);
        String normalizedRole = role.trim().toUpperCase(Locale.ROOT);

        if ("ROLE_ADMIN".equals(user.getRole()) && !"ROLE_ADMIN".equals(normalizedRole)
                && user.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new AccessDeniedException("You cannot remove your own admin role");
        }

        user.setRole(normalizedRole);
        return userRepository.save(user);
    }

    @Override
    public List<AdminPropertySummaryDto> getProperties(
            String city,
            String type,
            String availability,
            String agentId,
            String buyerId,
            String search
    ) {
        Query query = new Query();

        if (city != null && !city.isBlank()) {
            query.addCriteria(Criteria.where("city").regex(city.trim(), "i"));
        }

        if (type != null && !type.isBlank()) {
            query.addCriteria(Criteria.where("type").is(type.trim()));
        }

        if (agentId != null && !agentId.isBlank()) {
            query.addCriteria(Criteria.where("agentId").is(agentId.trim()));
        }

        if (buyerId != null && !buyerId.isBlank()) {
            query.addCriteria(Criteria.where("buyerId").is(buyerId.trim()));
        }

        if (availability != null && !availability.isBlank()) {
            if ("available".equalsIgnoreCase(availability.trim())) {
                query.addCriteria(Criteria.where("available").is(true));
            } else if ("sold".equalsIgnoreCase(availability.trim())) {
                query.addCriteria(new Criteria().orOperator(
                        Criteria.where("available").is(false),
                        Criteria.where("buyerId").ne(null).ne("")
                ));
            }
        }

        if (search != null && !search.isBlank()) {
            String pattern = search.trim();
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("title").regex(pattern, "i"),
                    Criteria.where("city").regex(pattern, "i"),
                    Criteria.where("state").regex(pattern, "i"),
                    Criteria.where("address").regex(pattern, "i")
            ));
        }

        query.with(Sort.by(Sort.Direction.DESC, "_id"));

        return mongoTemplate.find(query, Property.class)
                .stream()
                .map(this::toPropertySummary)
                .collect(Collectors.toList());
    }

    @Override
    public Property getPropertyById(String propertyId) {
        return propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));
    }

    @Override
    public Property reassignProperty(String propertyId, String agentId) {
        Property property = getPropertyById(propertyId);
        User targetAgent = getUserById(agentId);

        if (!"ROLE_AGENT".equals(targetAgent.getRole()) && !"ROLE_ADMIN".equals(targetAgent.getRole())) {
            throw new IllegalArgumentException("Property can only be assigned to an agent or admin");
        }

        property.setAgentId(targetAgent.getId());
        return propertyRepository.save(property);
    }

    private AdminUserSummaryDto toUserSummary(User user) {
        return new AdminUserSummaryDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                propertyRepository.countByAgentId(user.getId()),
                propertyRepository.countByBuyerId(user.getId())
        );
    }

    private AdminPropertySummaryDto toPropertySummary(Property property) {
        int imageCount = property.getImageUrls() == null ? 0 : property.getImageUrls().size();
        return new AdminPropertySummaryDto(
                property.getId(),
                property.getTitle(),
                property.getCity(),
                property.getState(),
                property.getType(),
                property.getPrice(),
                property.isAvailable(),
                property.getAgentId(),
                property.getBuyerId(),
                imageCount
        );
    }
}
