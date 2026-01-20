package com.wootae.backend.global.error;

import io.swagger.v3.oas.annotations.Hidden;
import jakarta.validation.ValidationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Hidden
@RestControllerAdvice
public class GlobalExceptionHandler {

    //1. 의도적으로 던진 에러 처리
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> illegalArgumentExceptionHandler(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(e.getMessage(),"BAD_REQUEST"));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> validationExceptionHandler(MethodArgumentNotValidException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage(), "VALIDATION_ERROR"));    }


    // 3. 그 외 예상치 못한 모든 에러 처리 (500 Server Error)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        e.printStackTrace(); // 서버 로그에는 에러 찍어주기
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("서버에 알 수 없는 문제가 발생했습니다.", "INTERNAL_SERVER_ERROR"));
    }

}
