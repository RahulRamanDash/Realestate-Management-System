package com.server.RealestateApiServer.Service;

import com.server.RealestateApiServer.Dto.AgentDto;
import com.server.RealestateApiServer.Entity.User;

public interface AgentService {
	User registerAgent(AgentDto agentDto);
    User loginAgent(String email, String password);
}
