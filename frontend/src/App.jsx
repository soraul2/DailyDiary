import './App.css'
import {Routes,Route} from 'react-router-dom'
import DetailDiary from "./pages/diary/DetailDiary.jsx";
import Diaries from "./pages/diary/Diaries.jsx";
import SaveDiary from "./pages/diary/SaveDiary.jsx";
import UpdateDiary from "./pages/diary/UpdateDiary.jsx";
import Index from "./pages/index/Index.jsx";
import Login from "./pages/user/Login.jsx";
import Join from "./pages/user/Join.jsx";


function App() {

  return (
    <>
      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<Index />} />

        {/* 유저 관련 */}
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />

        {/* 일기 관련 */}
        <Route path="/diaries" element={<Diaries />} />
        <Route path="/diaries/save" element={<SaveDiary />} />

        {/* 상세 보기와 수정은 뒤에 ID가 붙어야 하므로 :id (파라미터) 사용 */}
        <Route path="/diaries/:id" element={<DetailDiary />} />
        <Route path="/diaries/update/:id" element={<UpdateDiary />} />

      </Routes>
    </>
  )
}

export default App
