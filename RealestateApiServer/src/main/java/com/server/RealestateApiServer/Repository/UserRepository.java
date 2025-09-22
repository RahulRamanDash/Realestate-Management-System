package com.server.RealestateApiServer.Repository;

import com.server.RealestateApiServer.Entity.Agent;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AgentRepository extends MongoRepository<Agent, String> {
	 Agent findByEmail(String email);  // For login
}