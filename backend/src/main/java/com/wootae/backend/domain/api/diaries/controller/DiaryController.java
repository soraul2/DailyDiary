package com.wootae.backend.domain.api.diaries.controller;

import com.wootae.backend.domain.api.diaries.dto.DiaryDTO;
import com.wootae.backend.domain.api.diaries.service.DiaryService;
import com.wootae.backend.domain.api.user.dto.UserDTO;
import com.wootae.backend.domain.api.user.global.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "다이어리 API" , description = "다이어리 CRUD 관련 API")
@RestController
@RequestMapping("/api/diaries") // 공통 경로는 여기에
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;

    @Operation(summary = "일기 게시글 조회",description = "로그인 한 유저가 일기를 상세 조회 하는 기능입니다.")
    @GetMapping("/{id}")
    public ResponseEntity<DiaryDTO.Response> getOne(
            @PathVariable Long id,        // URL에 있는 숫자(3)를 가져옴
            @CurrentUser String username  // 로그인한 사람 확인용
    ) {
        DiaryDTO.Response response = diaryService.get(id, username);
        return ResponseEntity.ok(response);
    }
    @Operation(summary = "일기 작성",description = "로그인 한 유저가 일기를 작성하는 기능입니다.")
    @PostMapping("/save")
    public ResponseEntity<String> save(@CurrentUser String username, @Valid @RequestBody DiaryDTO.SaveRequest saveRequest) {
        diaryService.save(saveRequest, username);
        return ResponseEntity.ok().body("success");
    }

    @Operation(summary = "일기 삭제",description = "로그인 한 유저가 일기를 삭제하는 기능입니다.")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@CurrentUser String username, @PathVariable Long id) {
        diaryService.delete(id, username);
        return ResponseEntity.ok("일기가 삭제되었습니다.");
    }

    @Operation(summary = "일기 갱신",description = "로그인 한 유저가 일기를 업데이트 하는 기능입니다.")
    @PutMapping("/{id}")
    public ResponseEntity<String> update(@CurrentUser String username, @PathVariable Long id, @Valid @RequestBody DiaryDTO.SaveRequest request) {
        diaryService.update(id, username, request);
        return ResponseEntity.ok().body("일기가 수정이 완료됐습니다.");
    }


    @Operation(summary = "일기 목록 조회",description = "로그인 한 유저가 일기 목록을 조회하는 기능입니다.")
    @GetMapping
    public ResponseEntity<Page<DiaryDTO.Response>> getList(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @CurrentUser String username) {

        Page<DiaryDTO.Response> list = diaryService.getList(username, pageable);
        return ResponseEntity.ok(list);
    }
}
