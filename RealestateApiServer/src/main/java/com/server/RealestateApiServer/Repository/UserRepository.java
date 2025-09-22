package com.server.RealestateApiServer.Repository;

import com.server.RealestateApiServer.Entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
	 User findByEmail(String email);  // For login
}