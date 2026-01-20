package com.wootae.backend.domain.api.diaries.entity;

import com.wootae.backend.domain.api.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "diaries")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Diary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    @Column(nullable = false)
    private String subject;
    @Column(nullable = false)
    private String content;
    @Column(nullable = false)
    private String mood;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp // ✅ 하이버네이트 어노테이션 변경
    private LocalDateTime updatedAt;


    public void update(String subject,  String content, String mood) {
        this.subject = subject;
        this.content = content;
        this.mood = mood;
    }
}
