package com.wootae.backend.domain.api.diaries.repository;

import com.wootae.backend.domain.api.diaries.entity.Diary;

import com.wootae.backend.domain.api.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

    Page<Diary> findAllByUser(User user, Pageable pageable);
}
