import { useEffect } from "react";
import MainImage from "../components/MainImage";
import ContentsList from "../components/common/ContentsList";

export default function Home() {
  // 페이지 로드 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-100vh h-full mt-[3.625rem] mb-[3.75rem]">
      {/* 메인 이미지 */}
      <MainImage listName="trending" media="all" />

      {/* 컨텐츠 목록 */}
      <div className="w-full h-full flex flex-col p-[2.5rem] gap-[3.125rem]">
        {/* 영화 */}
        <ContentsList
          title="상영 중인 영화"
          listname="now_playing"
          media="movie"
        />
        <ContentsList //
          title="인기 있는 영화"
          listname="popular"
          media="movie"
        />
        <ContentsList
          title="평점 높은 영화"
          listname="top_rated"
          media="movie"
        />
        <ContentsList
          title="상영 예정 영화"
          listname="upcoming"
          media="movie"
        />

        {/* 구분선 */}
        <div className="w-full h-[0.0625rem] border-[0.0625rem] border-gray02"></div>

        {/* TV */}
        <ContentsList title="오늘 방영 TV" listname="airing_today" media="tv" />
        <ContentsList title="현재 방영 TV" listname="on_the_air" media="tv" />
        <ContentsList title="평점 높은 TV" listname="top_rated" media="tv" />
        <ContentsList title="있기 있는 TV" listname="popular" media="tv" />
      </div>
    </div>
  );
}
