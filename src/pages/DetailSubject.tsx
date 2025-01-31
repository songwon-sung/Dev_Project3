import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Content from "../components/common/Content";
import axios from "axios";
import { API_KEY, API_URL } from "../api/axios";
import arrowTop from "../assets/arrow/arrowTop.svg";
import arrowBottom from "../assets/arrow/arrowBottom.svg";

interface titleNameType {
  airing_today: string;
  on_the_air: string;
  popular: string;
  top_rated: string;
  now_playing: string;
  upcoming: string;
}

const titleName: titleNameType = {
  airing_today: "오늘 방영",
  on_the_air: "현재 방영",
  popular: "인기 있는",
  top_rated: "평점 높은",
  now_playing: "상영 중인",
  upcoming: "상영 예정",
};

interface genresType {
  id: number;
  name: string;
}

export default function DetailSubject() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [genres, setGenres] = useState<genresType[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("");

  const media = location.pathname.includes("tv") ? "tv" : "movie";
  const subject = location.pathname.replace(
    `/${media}_`,
    ""
  ) as keyof titleNameType;

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
    <div
      className="w-full min-h-100vh h-full mt-[3.625rem] mb-[60px] 
    flex flex-col gap-[30px] pt-[30px]"
    >
      <div className="text-white text-[1.25rem] text-center font-bold">
        {`${titleName[subject]} ${media.toUpperCase()}`}
      </div>
      <Content
        media={media}
        listname={subject}
        selectedGenres={selectedGenres}
        selectedSort={selectedSort}
      />
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
