
package com.server.RealestateApiServer.Controller;

import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.RealestateApiServer.Dto.UserDto;
import com.server.RealestateApiServer.Entity.User;
import com.server.RealestateApiServer.Service.UserService;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/agent")
public class UserController {
	
	@Autowired
	private UserService userService;
    
	
	@PostMapping("/register")
    public ResponseEntity<User> registerAgent(@RequestBody UserDto userDto) {
        User agent = userService.registerAgent(userDto);
        return ResponseEntity.ok(agent);
    }


	
    @PostMapping("/login")
    public ResponseEntity<User> loginAgent(@RequestBody @NotNull UserDto userDto) {
        User agent = userService.loginAgent(userDto.getEmail(), userDto.getPassword());
        if (agent != null) {
            return ResponseEntity.ok(agent);
        } else {
            return ResponseEntity.status(401).build();
        }
    }
}
