import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// Global CSS가 적용되어 있다고 가정

const DetailDiary = () => {
    const { id } = useParams(); // URL에서 id 가져오기 (예: /diaries/5 -> 5)
    const navigate = useNavigate();

    const [diary, setDiary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 기분 이모지 매핑
    const moodEmoji = {
        'HAPPY': '😊',
        'EXCITED': '😆',
        'NEUTRAL': '😐',
        'SAD': '😭',
        'ANGRY': '😡'
    };

    // 기분 한글 라벨
    const moodLabel = {
        'HAPPY': '행복해요',
        'EXCITED': '신나요',
        'NEUTRAL': '그저 그래요',
        'SAD': '슬퍼요',
        'ANGRY': '화나요'
    };

    // 1. 상세 데이터 가져오기
    useEffect(() => {
        const fetchDiaryDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/diaries/${id}`, {
                    withCredentials: true
                });
                setDiary(response.data);
            } catch (error) {
                console.error("일기 상세 조회 실패:", error);
                alert("일기를 불러오지 못했습니다.");
                navigate('/diaries'); // 에러 시 목록으로 이동
            } finally {
                setIsLoading(false);
            }
        };

        fetchDiaryDetail();
    }, [id, navigate]);

    // 2. 삭제 핸들러
    const handleDelete = async () => {
        if (window.confirm("정말로 이 일기를 삭제하시겠습니까?")) {
            try {
                // DELETE 메서드 호출 (백엔드에 해당 API가 구현되어 있어야 함)
                await axios.delete(`http://localhost:8080/api/diaries/${id}`, {
                    withCredentials: true
                });
                alert("일기가 삭제되었습니다.");
                navigate('/diaries'); // 삭제 후 목록으로 이동
            } catch (error) {
                console.error("삭제 실패:", error);
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    // 3. 수정 페이지 이동 핸들러
    const handleUpdate = () => {
        navigate(`/diaries/update/${id}`);
    };

    // 날짜 포맷팅
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    if (isLoading) {
        return <div style={{ padding: '50px', textAlign: 'center', color: '#86868B' }}>로딩 중...</div>;
    }

    if (!diary) {
        return <div style={{ padding: '50px', textAlign: 'center' }}>데이터가 없습니다.</div>;
    }

    return (
        <div className="apple-layout">
            <div className="apple-container">

                {/* 헤더 (뒤로가기 버튼 포함) */}
                <div className="apple-header" style={{ textAlign: 'left', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={() => navigate('/diaries')}
                        style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#007AFF', padding: '0' }}
                    >
                        ‹
                    </button>
                    <span
                        onClick={() => navigate('/diaries')}
                        style={{ fontSize: '17px', color: '#007AFF', cursor: 'pointer' }}
                    >
                        목록으로
                    </span>
                </div>

                {/* 상세 내용 카드 */}
                <div className="apple-card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>

                    {/* 상단 정보 (날짜, 기분) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #F5F5F7', paddingBottom: '16px' }}>
                        <span style={{ color: '#86868B', fontSize: '15px', fontWeight: '500' }}>
                            {formatDate(diary.createdAt)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F5F5F7', padding: '6px 12px', borderRadius: '20px' }}>
                            <span style={{ fontSize: '18px' }}>{moodEmoji[diary.mood]}</span>
                            <span style={{ fontSize: '13px', color: '#1D1D1F', fontWeight: '600' }}>
                                {moodLabel[diary.mood] || diary.mood}
                            </span>
                        </div>
                    </div>

                    {/* 제목 */}
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1D1D1F', marginBottom: '20px', lineHeight: '1.3' }}>
                        {diary.subject}
                    </h1>

                    {/* 내용 (줄바꿈 처리) */}
                    <div style={{
                        fontSize: '17px',
                        lineHeight: '1.6',
                        color: '#1D1D1F',
                        whiteSpace: 'pre-wrap', // ★ 중요: 엔터키(줄바꿈) 적용
                        flex: 1
                    }}>
                        {diary.content}
                    </div>

                    {/* 하단 버튼 영역 */}
                    <div style={{ marginTop: '40px', display: 'flex', gap: '10px' }}>
                        {/* 수정 버튼 (파란색) */}
                        <button
                            className="apple-button"
                            onClick={handleUpdate}
                            style={{ flex: 1, fontSize: '15px' }}
                        >
                            수정하기
                        </button>

                        {/* 삭제 버튼 (빨간색 - 애플 스타일 경고) */}
                        <button
                            className="apple-button"
                            onClick={handleDelete}
                            style={{
                                flex: 1,
                                backgroundColor: '#fff',
                                border: '1px solid #FF3B30',
                                color: '#FF3B30',
                                fontSize: '15px'
                            }}
                        >
                            삭제하기
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DetailDiary;