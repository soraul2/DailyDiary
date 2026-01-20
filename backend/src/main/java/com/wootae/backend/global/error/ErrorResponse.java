package com.wootae.backend.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor

public class ErrorResponse {
    private String message;
    private String code; // 필요하면 에러 코드 (예: "USER-001")

    // 편하게 쓰려고 만든 생성자
    public ErrorResponse(String message) {
        this.message = message;
        this.code = "ERROR";
    }
}