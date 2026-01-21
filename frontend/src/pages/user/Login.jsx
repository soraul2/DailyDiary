import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'; // 페이지 이동을 위해 필요
import axios from 'axios';

function Login() {
    const navigate = useNavigate(); // 이동 함수
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const {name, value} = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("일반 로그인 시도:", loginData);
        try {
            const response = await axios.post("http://localhost:8080/login", loginData);
            alert("로그인 성공!");
            console.log(response);
            navigate('/'); // 가입 성공 시 로그인 페이지로 자동 이동
        } catch (error) {
            console.log(error);
            alert("로그인 정보를 확인해주세요.");
        }
    };

    const handleSocialLogin = (provider) => {
        const BASE_URL = "http://localhost:8080";

        // provider는 'google' 또는 'naver'라는 문자열 자체입니다.
        // .value를 떼고 바로 비교해야 합니다.
        if (provider === 'google') {
            window.location.href = `${BASE_URL}/oauth2/authorization/google`;
        }
        else if (provider === 'naver') {
            window.location.href = `${BASE_URL}/oauth2/authorization/naver`;
        }
    };

    return (
        <div className="apple-layout">
            <div className="apple-container">
                {/* 1. 헤더 영역 */}
                <div className="apple-header">
                    <h1 className="apple-title">하루 일기장</h1>
                    <p className="apple-subtitle">당신의 하루를 기록하기 위해 로그인해주세요.</p>
                </div>

                {/* 2. 카드 영역 */}
                <div className="apple-card">
                    <form onSubmit={handleLogin}>
                        {/* 아이디 */}
                        <div className="input-group">
                            <label className="input-label">아이디</label>
                            <input
                                className="apple-input"
                                name="username"
                                type="text"
                                placeholder="아이디를 입력하세요"
                                value={loginData.username}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 비밀번호 */}
                        <div className="input-group">
                            <label className="input-label">비밀번호</label>
                            <input
                                className="apple-input"
                                name="password"
                                type="password"
                                placeholder="비밀번호를 입력하세요"
                                value={loginData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 3. 버튼 영역 (로그인 버튼들) */}
                        <div style={{marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                            <button type="submit" className="apple-button">
                                로그인
                            </button>

                            <button
                                type="button"
                                className="apple-button"
                                onClick={() => handleSocialLogin('naver')}
                                style={{backgroundColor: '#03C75A'}}
                            >
                                Naver 로그인
                            </button>

                            <button
                                type="button"
                                className="apple-button"
                                onClick={() => handleSocialLogin('google')}
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    color: '#1D1D1F',
                                    border: '1px solid #E5E5EA'
                                }}
                            >
                                Google 로그인
                            </button>
                        </div>

                        {/* 4. 회원가입 이동 링크 (추가된 부분) */}
                        <div style={{
                            marginTop: '24px',
                            textAlign: 'center',
                            fontSize: '14px',
                            color: '#86868B'
                        }}>
                            계정이 없으신가요?{' '}
                            <span
                                onClick={() => navigate('/join')} // '/join' 경로로 이동
                                style={{
                                    color: '#007AFF',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    marginLeft: '4px'
                                }}
                            >
                                회원가입
                            </span>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;