package com.wootae.backend.domain.api.diaries.dto;

import com.wootae.backend.domain.api.diaries.entity.Diary;
import com.wootae.backend.domain.api.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

public class DiaryDTO {

    @Builder
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Valid
    public static class SaveRequest {

        @Size(min = 1, max = 20)
        private String subject;
        @Size(min = 1, max = 200)
        private String content;
        @Size(min = 1, max = 10)
        private String mood;

        public Diary toEntity() {
            Diary diary = Diary.builder()
                    .subject(this.subject)
                    .content(this.content)
                    .mood(this.mood)
                    .build();
            return diary;
        }

    }//saveRequest

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response{
        private Long id;
        private String subject;
        private String content;
        private String mood;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static Response from(Diary diary) {
            return Response.builder()
                    .id(diary.getId())
                    .subject(diary.getSubject())
                    .content(diary.getContent())
                    .mood(diary.getMood())
                    .createdAt(diary.getCreatedAt())
                    .updatedAt(diary.getUpdatedAt())
                    .build();
        }
    }

}
