import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import TvPage from "./pages/TvPage";
import MoviePage from "./pages/MoviePage";
import SearchPage from "./pages/SearchPage";
import DetailContent from "./pages/DetailContent";
import DetailSubject from "./pages/DetailSubject";
import DetailEpisode from "./pages/DetailEpisode";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          {/* 홈 */}
          <Route path="/" element={<Home />}></Route>
          {/* 더보기 클릭 시 이동페이지 */}
          <Route path="/:subject" element={<DetailSubject />}></Route>
          {/* 더보기 클릭 시 이동페이지 */}
          <Route path="/:subject" element={<DetailSubject />}></Route>

          {/* tv */}
          <Route path="/tv" element={<TvPage />}></Route>
          {/* movie */}
          <Route path="/movie" element={<MoviePage />}></Route>

          {/* 컨텐츠 카드 클릭 시 이동페이지 */}
          <Route path="/detail/:media/:id" element={<DetailContent />}></Route>
          {/* 세부 시즌 카드 클릭 시 이동페이지 */}
          <Route
            path="/detail/:media/:id/:season"
            element={<DetailEpisode />}
          ></Route>

          {/* 검색페이지 */}
          <Route path="/search" element={<SearchPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
