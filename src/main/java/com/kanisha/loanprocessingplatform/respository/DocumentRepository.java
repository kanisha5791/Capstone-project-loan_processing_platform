package com.kanisha.loanprocessingplatform.respository;

import com.kanisha.loanprocessingplatform.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByCustomerEmail(String customerEmail);
}