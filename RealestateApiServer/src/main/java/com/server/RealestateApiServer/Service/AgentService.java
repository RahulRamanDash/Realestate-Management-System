package com.server.RealestateApiServer.Service;

import com.server.RealestateApiServer.Dto.AgentDto;
import com.server.RealestateApiServer.Entity.Agent;

public interface AgentService {
	Agent registerAgent(AgentDto agentDto);
    Agent loginAgent(String email, String password);
}
