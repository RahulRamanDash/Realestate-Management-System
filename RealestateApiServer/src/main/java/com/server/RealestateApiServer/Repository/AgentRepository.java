package com.server.RealestateApiServer.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.server.RealestateApiServer.Entity.Agent;

public interface AgentRepository extends JpaRepository<Agent, Long>{
	 Agent findByEmail(String email);  // For login
}
