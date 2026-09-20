package com.kanisha.loanprocessingplatform.service;

import com.kanisha.loanprocessingplatform.entity.Document;
import com.kanisha.loanprocessingplatform.respository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    public Document saveDocument(Document document) {
        return documentRepository.save(document);
    }

    public List<Document> getDocumentsByCustomerEmail(String email) {
        return documentRepository.findByCustomerEmail(email);
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Document updateStatus(Long id, String status) {

        Document document = documentRepository
                .findById(id)
                .orElse(null);

        if (document == null) {
            return null;
        }

        document.setStatus(status);

        return documentRepository.save(document);
    }
}