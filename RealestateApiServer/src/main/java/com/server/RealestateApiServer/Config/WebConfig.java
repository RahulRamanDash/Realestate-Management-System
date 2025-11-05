package com.server.RealestateApiServer.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/api/upload/images/**")
                .addResourceLocations("file:E:/Projects/Realestate-Management-System/realestate-frontend/public/uploads/")
                .setCachePeriod(3600) // optional, for caching
                .resourceChain(true);
    }
}