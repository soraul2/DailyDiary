package com.wootae.backend.domain.api.user.service;

import com.wootae.backend.domain.api.user.dto.UserDTO;
import com.wootae.backend.domain.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;

    @Transactional
    public void join(UserDTO.JoinRequest request){
        //1. 동일한 username 이 있는지 확인
        if(userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException("이미 존재하는 회원입니다.");
        }
        //2. password 를 encod
        String password = bCryptPasswordEncoder.encode(request.getPassword());

        //3. 가입
        userRepository.save(request.toEntity(password));
    }
}
