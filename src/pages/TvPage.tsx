import React, { useEffect, useMemo, useState } from "react";
import MainImage from "../components/MainImage";
import ContentsArray from "../components/common/ContentsArray";
import arrowTop from "../assets/arrow/arrowTop.svg";
import arrowBottom from "../assets/arrow/arrowBottom.svg";
import axios from "axios";
import { API_KEY, API_URL } from "../api/axios";
import { useLocation } from "react-router-dom";

interface genresType {
  id: number;
  name: string;
}

export default function TvPage() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [genres, setGenres] = useState<genresType[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("");

  /* 미디어 타입 추출 */
  const media = useMemo(
    () => (location.pathname.includes("tv") ? "tv" : "movie"),
    [location.pathname]
  );

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const { data } = await axios.get(`${API_URL}genre/${media}/list`, {
          params: {
            api_key: API_KEY,
            language: "ko",
          },
        });

        if (data?.genres) {
          setGenres(data.genres);
        }
      } catch (error) {
        console.error("Error fetching genres", error);
      }
    };

    fetchGenres();
  }, [media]);

  /* 장르 선택 함수 */
  const selectGenres = (genre: genresType) => {
    setSelectedGenres(
      (prevGenres) =>
        prevGenres.includes(genre.name)
          ? prevGenres.filter((g) => g !== genre.name) // 이미 선택된 경우 해제
          : [...prevGenres, genre.name] // 새로 추가
    );
  };

  /* 정렬 기준 설정 함수 */
  const handleSortChange = (sortOption: string) => {
    if (selectedSort === sortOption) {
      setSelectedSort(""); // 이미 선택된 정렬이면 취소
    } else {
      setSelectedSort(sortOption); // 새로 정렬 선택
    }
  };

  return (
    <div className="w-full min-h-100vh h-full mt-[3.625rem] mb-[5.75rem]">
      {/* 메인 이미지 */}
      <MainImage listName="trending" media="tv" />

      {/* 컨텐츠 목록 */}
      <div
        className="w-full min-h-screen h-full flex flex-col 
      p-[1.875rem] gap-[3.125rem] bg-black"
      >
        <ContentsArray
          media="tv"
          selectedGenres={selectedGenres}
          selectedSort={selectedSort}
        />
      </div>
      {/* 필터창 */}
      {location.pathname === "/" || (
        <div
          className={`w-[30rem]  ${
            open ? "p-[1.25rem]" : "h-[2rem]"
          } bg-black/90 fixed bottom-[3.75rem] 
            flex justify-center items-center`}
        >
          {open ? (
            <div className="flex flex-col items-center gap-[1.25rem]">
              <img
                src={arrowBottom}
                alt="arrowBottom"
                className="cursor-pointer w-[0.75rem]"
                onClick={() => setOpen((prev) => !prev)}
              />

              {/* 장르 선택 영역 */}
              <div className="w-full text-[1.25rem] text-white text-center">
                장르
              </div>
              <div
                className="text-gray01 flex flex-wrap justify-center 
              gap-x-[0.3125rem] gap-y-[0.625rem]"
              >
                {genres.map((genre) => (
                  <div
                    key={genre.id}
                    className={`text-[0.8125rem] font-bold px-[0.625rem] py-[0.3125rem]
                  border-[0.0625rem] rounded-[0.3125rem] 
                  ${
                    selectedGenres.includes(genre.name)
                      ? "bg-main text-black border-main" // 선택된 경우 (main 색상 적용)
                      : "bg-gray02 border-gray01/50 text-gray01" // 기본 상태
                  } cursor-pointer
                  `}
                    onClick={() => selectGenres(genre)}
                  >
                    {genre.name}
                  </div>
                ))}
              </div>

              {/* 정렬 선택 영역 */}
              <div className="w-full text-[1.25rem] text-white text-center">
                정렬
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {["제목순", "날짜순", "평점순", "인기순"].map(
                  (option, index) => {
                    const value = ["title", "date", "rating", "popular"][index];
                    return (
                      <div
                        key={value}
                        className={`text-[0.8125rem] font-bold px-[0.625rem] py-[0.3125rem] rounded-[0.3125rem] 
                        border-[0.0625rem] cursor-pointer 
                        ${
                          selectedSort === value
                            ? "bg-main text-black border-main"
                            : "bg-gray02 border-gray01/50 text-gray01"
                        }`}
                        onClick={() => handleSortChange(value)}
                      >
                        {option}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          ) : (
            <img
              src={arrowTop}
              alt="arrowTop"
              className="cursor-pointer w-[0.75rem]"
              onClick={() => setOpen((prev) => !prev)}
            />
          )}
        </div>
      )}
    </div>
  );
}
