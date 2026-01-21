import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동 훅 추가
import axios from 'axios';
// Global CSS가 main.jsx에 있다면 import 안 해도 되지만,
// 확실하게 하기 위해 남겨두셔도 됩니다.
// import './AppleDesign.css';

function Join() {
    const navigate = useNavigate(); // 이동 함수 초기화

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nickname: '',
        email: ''
    });

    const changeInputHandle = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const onSubmitClick = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            alert("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/user/join', formData);
            console.log(response);
            alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
            navigate('/login'); // 가입 성공 시 로그인 페이지로 자동 이동
        } catch (error) {
            console.error(error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    return (
        <div className="apple-layout">
            <div className="apple-container">
                {/* 헤더 */}
                <div className="apple-header">
                    <h1 className="apple-title">회원가입</h1>
                    <p className="apple-subtitle">나만의 일기장을 만들어보세요.</p>
                </div>

                {/* 카드 */}
                <div className="apple-card">
                    <form>
                        <div className="input-group">
                            <label className="input-label">아이디</label>
                            <input
                                className="apple-input"
                                name="username"
                                type="text"
                                placeholder="사용할 아이디"
                                value={formData.username}
                                onChange={changeInputHandle}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">비밀번호</label>
                            <input
                                className="apple-input"
                                name="password"
                                type="password"
                                placeholder="비밀번호"
                                value={formData.password}
                                onChange={changeInputHandle}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">닉네임</label>
                            <input
                                className="apple-input"
                                name="nickname"
                                type="text"
                                placeholder="별명"
                                value={formData.nickname}
                                onChange={changeInputHandle}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">이메일</label>
                            <input
                                className="apple-input"
                                name="email"
                                type="email"
                                placeholder="example@email.com"
                                value={formData.email}
                                onChange={changeInputHandle}
                            />
                        </div>

                        {/* 가입 버튼 */}
                        <button className="apple-button" onClick={onSubmitClick}>
                            가입하기
                        </button>

                        {/* 로그인 페이지 이동 링크 (추가됨) */}
                        <div style={{
                            marginTop: '24px',
                            textAlign: 'center',
                            fontSize: '14px',
                            color: '#86868B'
                        }}>
                            이미 계정이 있으신가요?{' '}
                            <span
                                onClick={() => navigate('/login')} // '/login'으로 이동
                                style={{
                                    color: '#007AFF',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    marginLeft: '4px'
                                }}
                            >
                                로그인
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Join;