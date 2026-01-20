package com.wootae.backend.domain.api.diaries.service;

import com.wootae.backend.domain.api.diaries.dto.DiaryDTO;
import com.wootae.backend.domain.api.diaries.entity.Diary;
import com.wootae.backend.domain.api.diaries.repository.DiaryRepository;
import com.wootae.backend.domain.api.user.entity.User;
import com.wootae.backend.domain.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DiaryService {

    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;


    @Transactional(readOnly = true)
    public DiaryDTO.Response get(Long id, String username){
        Diary diary = diaryRepository.findById(id).orElseThrow(()->new IllegalArgumentException("해당 글 존재하지 않음"));
        if(!diary.getUser().getUsername().equals(username)){
            throw new IllegalArgumentException("권한 없음");
        }
        DiaryDTO.Response response = DiaryDTO.Response.from(diary);
        return response;
    }

    @Transactional(readOnly = true)
    public Page<DiaryDTO.Response> getList(String username, Pageable pageable){
        User user = userRepository.findByUsername(username).orElseThrow(()-> new IllegalArgumentException("유저 없음"));

        Page<Diary> diaryPage = diaryRepository.findAllByUser(user, pageable);

        return diaryPage.map(diary -> DiaryDTO.Response.builder()
                .id(diary.getId())
                .subject(diary.getSubject())
                .mood(diary.getMood())
                .createdAt(diary.getCreatedAt())
                .build()
        );
    }


    @Transactional
    public void delete(Long id , String username){
        Diary diary = diaryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시물이 존재하지 않습니다."));
        if (!diary.getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("삭제 권한이 없습니다."); // 혹은 AccessDeniedException
        }

        diaryRepository.delete(diary);

    }

    @Transactional
    public void save(DiaryDTO.SaveRequest saveRequest,String username) {
        Diary diary = saveRequest.toEntity();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("해당 아이디가 존재하지 않습니다."));
        diary.setUser(user);

        diaryRepository.save(diary);

    }

    @Transactional
    public void update(Long id , String username , DiaryDTO.SaveRequest request){

        Diary diary = diaryRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("해당 다이어리가 존재하지 않습니다."));

        if(!diary.getUser().getUsername().equals(username)){
            throw new IllegalArgumentException("업데이트 권한이 존재하지 않습니다.");
        }

        request.toEntity();

        diary.update(request.getSubject(), request.getContent(), request.getMood());

    }

}
