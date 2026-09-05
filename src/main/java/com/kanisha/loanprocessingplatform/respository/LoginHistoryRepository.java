package com.kanisha.loanprocessingplatform.respository;

import com.kanisha.loanprocessingplatform.entity.LoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginHistoryRepository
        extends JpaRepository<LoginHistory, Long> {
}