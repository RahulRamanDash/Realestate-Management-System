package com.server.RealestateApiServer.Controller;

import com.server.RealestateApiServer.Service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final FileStorageService fileStorageService;

    @PostMapping("/images")
    public Map<String, String> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        return Map.of("url", fileStorageService.storeImage(file));
    }
}
