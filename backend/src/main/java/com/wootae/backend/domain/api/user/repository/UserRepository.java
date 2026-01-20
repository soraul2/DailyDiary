package com.wootae.backend.domain.api.user.repository;

import com.wootae.backend.domain.api.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    //1. [회원가입]
    boolean existsByUsername(String username);

    //2. [OAuth2 회원가입]
    Optional<User> findByUsername(String username);
}
