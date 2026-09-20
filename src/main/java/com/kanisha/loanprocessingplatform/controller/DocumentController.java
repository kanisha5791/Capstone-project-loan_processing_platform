package com.kanisha.loanprocessingplatform.controller;

import com.kanisha.loanprocessingplatform.entity.Document;
import com.kanisha.loanprocessingplatform.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/documents")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
})
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("email") String email,
            @RequestParam("documentType") String documentType) {

        try {

            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Please select a file");
            }

            String uploadDirectory = "uploads/";

            Path directory = Paths.get(uploadDirectory);

            if (!Files.exists(directory)) {
                Files.createDirectories(directory);
            }

            String fileName = System.currentTimeMillis()
                    + "_" + file.getOriginalFilename();

            Path filePath = directory.resolve(fileName);

            Files.copy(file.getInputStream(), filePath);

            Document document = new Document();

            document.setCustomerEmail(email);
            document.setDocumentType(documentType);
            document.setFileName(file.getOriginalFilename());
            document.setFilePath(filePath.toString());
            document.setStatus("Pending");

            Document savedDocument =
                    documentService.saveDocument(document);

            return ResponseEntity.ok(savedDocument);

        } catch (IOException e) {

            return ResponseEntity.internalServerError()
                    .body("File upload failed");
        }
    }

    @GetMapping("/customer")
    public List<Document> getCustomerDocuments(
            @RequestParam String email) {

        return documentService
                .getDocumentsByCustomerEmail(email);
    }

    @GetMapping
    public List<Document> getAllDocuments() {

        return documentService.getAllDocuments();
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<?> viewDocument(@PathVariable Long id) {

        try {
            Document document = documentService
                    .getAllDocuments()
                    .stream()
                    .filter(doc -> doc.getId().equals(id))
                    .findFirst()
                    .orElse(null);

            if (document == null) {
                return ResponseEntity.notFound().build();
            }

            Path path = Paths.get(document.getFilePath());

            if (!Files.exists(path)) {
                return ResponseEntity.notFound().build();
            }

            byte[] fileBytes = Files.readAllBytes(path);

            String contentType = Files.probeContentType(path);

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .header(
                            "Content-Disposition",
                            "inline; filename=\"" +
                                    document.getFileName() + "\""
                    )
                    .header(
                            "Content-Type",
                            contentType
                    )
                    .body(fileBytes);

        } catch (IOException e) {

            return ResponseEntity.internalServerError()
                    .body("Unable to open document");
        }
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateDocumentStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Document document =
                documentService.updateStatus(id, status);

        if (document == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(document);
    }
}