package com.server.RealestateApiServer.Config;

import com.server.RealestateApiServer.Service.FileStorageService;
import java.nio.file.Path;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final FileStorageService fileStorageService;

    public WebConfig(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path absoluteUploadPath = fileStorageService.getUploadRoot();

        registry.addResourceHandler("/api/upload/images/**")
                .addResourceLocations("file:" + absoluteUploadPath + "/")
                .setCachePeriod(3600)
                .resourceChain(true);
    }
}
