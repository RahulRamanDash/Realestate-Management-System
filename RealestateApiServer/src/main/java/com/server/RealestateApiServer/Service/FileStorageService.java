package com.server.RealestateApiServer.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
    );

    private final Path uploadRoot;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) throws IOException {
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(this.uploadRoot);
    }

    public String storeImage(MultipartFile file) throws IOException {
        validateImage(file);

        String cleanName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "image" : file.getOriginalFilename());
        String extension = "";
        int extensionIndex = cleanName.lastIndexOf('.');
        if (extensionIndex >= 0) {
            extension = cleanName.substring(extensionIndex);
        }

        String filename = UUID.randomUUID() + extension.toLowerCase();
        Path target = uploadRoot.resolve(filename).normalize();

        if (!target.startsWith(uploadRoot)) {
            throw new IllegalArgumentException("Invalid file path");
        }

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, target, StandardCopyOption.REPLACE_EXISTING);
        }

        return "/api/upload/images/" + filename;
    }

    public List<String> storeImages(List<MultipartFile> files) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        if (files == null) {
            return imageUrls;
        }

        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                imageUrls.add(storeImage(file));
            }
        }
        return imageUrls;
    }

    public Path getUploadRoot() {
        return uploadRoot;
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Only JPG, PNG, WEBP, and GIF image uploads are allowed");
        }
    }
}
