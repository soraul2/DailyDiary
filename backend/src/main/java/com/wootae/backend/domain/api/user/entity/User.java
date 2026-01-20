package com.wootae.backend.domain.api.user.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username; // provider + - + providerId
    private String password;
    @Column(nullable = false)
    private String nickname;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime createDate;
    @Column(nullable = false)
    private String role;
    @Column(nullable = false)
    private String provider; //user local , google google , naver naver
    private String providerId;


}
