import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Global CSS가 main.jsx에 있다면 import 생략 가능
// import '../../AppleDesign.css';

const SaveDiary = () => {
    const navigate = useNavigate();

    // 1. 폼 데이터 상태 관리
    const [formData, setFormData] = useState({
        subject: '',
        content: '',
        mood: ''
    });

    const moodOptions = [
        { code: 'HAPPY', emoji: '😊', label: '행복' },
        { code: 'EXCITED', emoji: '😆', label: '신남' },
        { code: 'NEUTRAL', emoji: '😐', label: '평범' },
        { code: 'SAD', emoji: '😭', label: '슬픔' },
        { code: 'ANGRY', emoji: '😡', label: '화남' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMoodSelect = (moodCode) => {
        setFormData({ ...formData, mood: moodCode });
    };

    const handleSubmit = async () => {
        if (!formData.mood) {
            alert("오늘의 기분을 선택해주세요!");
            return;
        }
        if (!formData.subject || !formData.content) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/diaries/save', formData, {
                withCredentials: true
            });

            if (response.status === 200) {
                alert("일기가 성공적으로 저장되었습니다! 🎉");
                navigate('/diaries');
            }
        } catch (error) {
            console.error("일기 저장 실패:", error);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="apple-layout">
            <div className="apple-container">

                {/* 헤더: 문구를 한 줄로 변경 */}
                <div className="apple-header">
                    <h1 className="apple-title">오늘의 기록</h1>
                    <p className="apple-subtitle" style={{ marginTop: '8px' }}>
                        오늘 하루는 어떠셨나요? 당신의 이야기를 들려주세요.
                    </p>
                </div>

                {/* 입력 폼 카드 */}
                <div className="apple-card">

                    {/* 1. 기분 선택 (여백 최적화) */}
                    <div className="input-group">
                        <label className="input-label" style={{ marginBottom: '8px', marginLeft: '2px' }}>
                            오늘의 기분
                        </label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {moodOptions.map((option) => (
                                <button
                                    key={option.code}
                                    onClick={() => handleMoodSelect(option.code)}
                                    type="button"
                                    style={{
                                        flex: '1', // 버튼들이 균등하게 꽉 차게 함
                                        padding: '12px 0', // 위아래 패딩 조정
                                        backgroundColor: formData.mood === option.code ? '#E5F1FF' : '#F5F5F7',
                                        border: formData.mood === option.code ? '2px solid #007AFF' : '2px solid transparent',
                                        borderRadius: '14px', // 모서리 둥글기 살짝 조정
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minWidth: '50px'
                                    }}
                                >
                                    <span style={{ fontSize: '22px', lineHeight: '1' }}>{option.emoji}</span>
                                    <span style={{ fontSize: '11px', marginTop: '4px', color: '#1D1D1F', fontWeight: '600' }}>
                                        {option.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. 제목 입력 */}
                    <div className="input-group">
                        <label className="input-label" style={{ marginLeft: '2px' }}>제목</label>
                        <input
                            className="apple-input"
                            name="subject"
                            placeholder="오늘의 하루를 한 문장으로 표현한다면?"
                            value={formData.subject}
                            onChange={handleChange}
                        />
                    </div>

                    {/* 3. 내용 입력 */}
                    <div className="input-group">
                        <label className="input-label" style={{ marginLeft: '2px' }}>내용</label>
                        <textarea
                            className="apple-input"
                            name="content"
                            placeholder="오늘 있었던 일, 느꼈던 감정을 솔직하게 적어보세요."
                            value={formData.content}
                            onChange={handleChange}
                            rows={10}
                            style={{ resize: 'none', lineHeight: '1.6' }}
                        />
                    </div>

                    {/* 4. 저장 버튼 */}
                    <div style={{ marginTop: '10px' }}>
                        <button className="apple-button" onClick={handleSubmit}>
                            일기 저장하기
                        </button>
                        <button
                            className="apple-button"
                            onClick={() => navigate(-1)}
                            style={{ backgroundColor: 'transparent', color: '#86868B', marginTop: '0', fontSize: '15px' }}
                        >
                            취소
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SaveDiary;