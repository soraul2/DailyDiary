import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// Global CSS 사용 가정

const UpdateDiary = () => {
    const { id } = useParams(); // URL에서 수정할 일기 ID 가져오기
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        subject: '',
        content: '',
        mood: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    // 기분 선택지 (작성 페이지와 동일)
    const moodOptions = [
        { code: 'HAPPY', emoji: '😊', label: '행복' },
        { code: 'EXCITED', emoji: '😆', label: '신남' },
        { code: 'NEUTRAL', emoji: '😐', label: '평범' },
        { code: 'SAD', emoji: '😭', label: '슬픔' },
        { code: 'ANGRY', emoji: '😡', label: '화남' },
    ];

    // 1. 기존 일기 데이터 가져오기 (초기화)
    useEffect(() => {
        const fetchDiary = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/diaries/${id}`, {
                    withCredentials: true
                });
                // 받아온 데이터로 폼 채우기
                setFormData({
                    subject: response.data.subject,
                    content: response.data.content,
                    mood: response.data.mood
                });
            } catch (error) {
                console.error("데이터 불러오기 실패:", error);
                alert("일기 정보를 불러올 수 없습니다.");
                navigate('/diaries'); // 에러 시 목록으로 튕김
            } finally {
                setIsLoading(false);
            }
        };

        fetchDiary();
    }, [id, navigate]);

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 기분 선택 핸들러
    const handleMoodSelect = (moodCode) => {
        setFormData({ ...formData, mood: moodCode });
    };

    // 2. 수정 요청 (PUT)
    const handleUpdate = async () => {
        if (!formData.subject || !formData.content || !formData.mood) {
            alert("모든 내용을 입력해주세요.");
            return;
        }

        try {
            await axios.put(`http://localhost:8080/api/diaries/${id}`, formData, {
                withCredentials: true
            });

            alert("일기가 성공적으로 수정되었습니다! ✨");
            navigate(`/diaries/${id}`); // 수정 후 상세 페이지로 이동
        } catch (error) {
            console.error("수정 실패:", error);
            alert("일기 수정 중 오류가 발생했습니다.");
        }
    };

    if (isLoading) {
        return <div style={{ padding: '50px', textAlign: 'center', color: '#86868B' }}>로딩 중...</div>;
    }

    return (
        <div className="apple-layout">
            <div className="apple-container">

                {/* 헤더 */}
                <div className="apple-header">
                    <h1 className="apple-title">일기 수정하기</h1>
                    <p className="apple-subtitle" style={{ marginTop: '8px' }}>
                        기록했던 내용을 다시 다듬어보세요.
                    </p>
                </div>

                {/* 입력 폼 카드 */}
                <div className="apple-card">

                    {/* 1. 기분 선택 */}
                    <div className="input-group">
                        <label className="input-label" style={{ marginBottom: '8px', marginLeft: '2px' }}>
                            오늘의 기분 (수정)
                        </label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {moodOptions.map((option) => (
                                <button
                                    key={option.code}
                                    onClick={() => handleMoodSelect(option.code)}
                                    type="button"
                                    style={{
                                        flex: '1',
                                        padding: '12px 0',
                                        backgroundColor: formData.mood === option.code ? '#E5F1FF' : '#F5F5F7',
                                        border: formData.mood === option.code ? '2px solid #007AFF' : '2px solid transparent',
                                        borderRadius: '14px',
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
                            placeholder="제목을 입력하세요"
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
                            placeholder="내용을 입력하세요"
                            value={formData.content}
                            onChange={handleChange}
                            rows={10}
                            style={{ resize: 'none', lineHeight: '1.6' }}
                        />
                    </div>

                    {/* 4. 버튼 영역 */}
                    <div style={{ marginTop: '10px' }}>
                        <button className="apple-button" onClick={handleUpdate}>
                            수정 완료
                        </button>
                        <button
                            className="apple-button"
                            onClick={() => navigate(-1)} // 뒤로가기
                            style={{ backgroundColor: 'transparent', color: '#86868B', marginTop: '0', fontSize: '15px' }}
                        >
                            취소하고 돌아가기
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UpdateDiary;