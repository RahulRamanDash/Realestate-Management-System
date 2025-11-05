package com.server.RealestateApiServer.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @Value("${file.upload-dir}")
    private String uploadDir;

//    @GetMapping("/images/{filename}")
//    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
//        try {
//            Path filePath = Paths.get(uploadDir).resolve(filename);
//            Resource resource = new UrlResource(filePath.toUri());
//            System.out.println(uploadDir);
//            System.out.println(filePath.toUri());
//            if (resource.exists()) {
//                return ResponseEntity.ok()
//                        .contentType(MediaType.IMAGE_JPEG)
//                        .body(resource);
//            } else {
//                System.out.println("image not there");
//                return ResponseEntity.notFound().build();
//            }
//        } catch (MalformedURLException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }

    @PostMapping("/images")
    public String uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();

        // Handle null or empty filename
        if (originalFilename == null || originalFilename.isBlank()) {
            String extension = ".jpg"; // Default extension (or detect from content type)
            originalFilename = "upload_" + System.currentTimeMillis() + extension;
        }

        Path filePath = uploadPath.resolve(originalFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return the URL that React can use
        return "/api/uploads/images/" + file.getOriginalFilename();
    }
}