import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { API_KEY, API_URL, IMAGE_BASE_URL } from "../../api/axios";
import noImage from "../../assets/noImage/noImage.svg";
import scrollButtonLeft from "../../assets/button/scrollButtonLeft.svg";
import scrollButtonRight from "../../assets/button/scrollButtonRight.svg";
import { Link, useLocation } from "react-router-dom";

interface ContentsProps {
  title?: string;
  media?: string;
  listname: string;
  selectedGenres?: string[];
  selectedSort?: string;
}

interface ContentsType {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  poster_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  popularity: number;
}

interface GenreType {
  id: number;
  name: string;
}

export default function Content(props: ContentsProps) {
  const [contents, setContents] = useState<ContentsType[]>([]);
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isFirst, setIsFirst] = useState(true); // 첫 번째 이미지인지 체크
  const [isLast, setIsLast] = useState(false); // 마지막 이미지인지 체크
  const [genres, setGenres] = useState<GenreType[]>([]);
  const [pages, setPages] = useState<number>(1);

  // 선택된 장르 ID 배열과 정렬 기준이 있을 때만 처리
  const selectedGenres = props.selectedGenres || [];
  const selectedSort = props.selectedSort || "popular";

  const selectedGenreIds = genres
    .filter((genre) => selectedGenres.includes(genre.name))
    .map((genre) => genre.id);

  // 영화 더 불러오기
  const moreContent = () => {
    setPages((prev) => prev + 1);
  };

  /* 데이터 불러오기 */
  useEffect(() => {
    const media = props.media === "tv" ? "tv" : "movie";

    const fetchContents = async () => {
      const contentsList = `${media}/${props.listname}?api_key=${API_KEY}&language=ko-kr&page=${pages}`;
      const genresList = `genre/${media}/list?api_key=${API_KEY}&language=ko-kr`;

      try {
        const [contentsResponse, genresResponse] = await Promise.all([
          axios.get(`${API_URL}${contentsList}`),
          axios.get(`${API_URL}${genresList}`),
        ]);
        const fetchedContents: ContentsType[] = contentsResponse.data.results;
        // console.log(contents);

        // 컨텐츠
        if (location.pathname === "/") {
          // 현재 home페이지일 경우에만 10개
          setContents(fetchedContents.slice(0, 10));
        } else {
          // 컨텐츠 중복 검사
          setContents((prevContents) => [
            ...prevContents,
            ...fetchedContents.filter(
              (content) =>
                !prevContents.some(
                  (prevContent) => prevContent.id === content.id
                )
            ),
          ]);
        }

        // 장르
        if (genresResponse.data && genresResponse.data.genres) {
          setGenres(genresResponse.data.genres);
        } else {
          console.error("Genres data not found");
        }
      } catch (error) {
        console.error("Error fetching contents:", error);
      }
    };
    fetchContents();
  }, [props.media, pages]);
  // console.log(contents);

  /* 해당되는 장르의 컨텐츠만 분류 */
  const filteredContents = contents.filter(
    (content) =>
      selectedGenres.length === 0 ||
      content.genre_ids.some((id) => selectedGenreIds.includes(id))
  );

  /* 선택된 정렬에 따라 정렬하기 */
  const sortedContents = useMemo(() => {
    switch (selectedSort) {
      case "title":
        return [...filteredContents].sort((a, b) =>
          (a.title || "").localeCompare(b.title || "")
        );
      case "date":
        return [...filteredContents].sort((a, b) => {
          const dateA = a.release_date || a.first_air_date || "";
          const dateB = b.release_date || b.first_air_date || "";
          return new Date(dateB).getTime() - new Date(dateA).getTime(); // 내림차순
        });
      case "rating":
        return [...filteredContents].sort(
          (a, b) => b.vote_average - a.vote_average
        ); // 내림차순
      case "popular":
        return [...filteredContents].sort(
          (a, b) => b.popularity - a.popularity
        ); // 내림차순
      default:
        return filteredContents;
    }
  }, [props.selectedSort, filteredContents]);

  // 장르 ID 배열을 이용하여 장르명을 찾고, 최대 2개까지만 반환
  const getGenreNames = (genreIds: number[]) => {
    return genreIds
      .map((id) => genres.find((genre) => genre.id === id)?.name)
      .filter((name): name is string => !!name)
      .slice(0, 2); // 최대 2개만
  };

  /* 왼쪽 스크롤 버튼 함수 */
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  /* 오른쪽 스크롤 버튼 함수 */
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // 스크롤 위치에 따라 첫 번째/마지막 이미지 여부를 판단하는 함수
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeftPosition = scrollContainerRef.current.scrollLeft;
      const scrollWidth = scrollContainerRef.current.scrollWidth;
      const containerWidth = scrollContainerRef.current.offsetWidth;

      setIsFirst(scrollLeftPosition === 0);
      setIsLast(scrollLeftPosition + containerWidth === scrollWidth);
    }
  };

  useEffect(() => {
    // 스크롤 이벤트 리스너 추가
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", handleScroll);
    }

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div
      className={`flex ${
        location.pathname !== "/"
          ? "flex-col"
          : "flex-row flex-nowrap overflow-hidden"
      } gap-[30px]`}
    >
      <div
        className={`absolute w-[25rem] flex justify-between ${
          location.pathname !== "/" ? "hidden" : ""
        }`}
      >
        {/* 왼쪽 토글 버튼 */}
        <div
          className={`absolute left-0 w-[6.25rem] h-[11.1875rem] pl-[0.625rem]
            flex flex-col justify-center items-start ${
              isFirst ? "hidden" : ""
            }`}
          style={{
            backgroundImage: `linear-gradient(to left, #00000000, #000000)`,
          }}
        >
          <img
            src={scrollButtonLeft}
            className="opacity-80 cursor-pointer"
            onClick={scrollLeft}
          />
        </div>

        {/* 오른쪽 토글 버튼 */}
        <div
          className={`absolute right-0 w-[6.25rem] h-[11.1875rem] pr-[0.625rem]
            flex flex-col justify-center items-end ${isLast ? "hidden" : ""}`}
          style={{
            backgroundImage: `linear-gradient(to right, #00000000, #000000)`,
          }}
        >
          <img
            src={scrollButtonRight}
            className="opacity-80 cursor-pointer"
            onClick={scrollRight}
          />
        </div>
      </div>
      {/* 컨텐츠 목록 */}
      <div
        ref={scrollContainerRef}
        style={{ scrollBehavior: "smooth" }}
        className={`w-full ${
          location.pathname === "/"
            ? "overflow-hidden flex gap-[30px]"
            : "flex flex-wrap h-fit justify-start px-[55px] gap-[20px]"
        } scrollbar-hide`}
      >
        {sortedContents.map((content) => (
          <div key={content.id} className="h-fit flex flex-col gap-[10px]">
            {/* 컨텐츠 이미지 */}
            <Link
              to={`/detail/${props.media}/${content.id}`}
              className="w-[6.875rem] h-[8.625rem]"
            >
              <img
                src={
                  content.poster_path
                    ? `${IMAGE_BASE_URL}original${content.poster_path}`
                    : noImage
                }
                alt="poster image"
                className="w-full h-full object-cover rounded-[0.3125rem]"
              />
            </Link>

            {/* 컨텐츠 목록 */}
            <div className="w-[6.875rem] flex flex-col gap-[0.125rem]">
              {/* 컨텐츠 제목 */}
              <div
                className="text-gray01 font-bold text-[1rem] 
              overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {content.title || content.name}
              </div>

              {/* 컨텐츠 정보 */}
              <div className="flex justify-between">
                {/* 상영연도 */}
                <div className="text-gray02 text-[0.8125rem]">
                  {content.release_date
                    ? content.release_date.slice(0, 4) // 연도만 표시
                    : content.first_air_date?.slice(0, 4)}
                </div>

                {/* 평점 */}
                <div className="text-gray02 text-[0.8125rem]">
                  {content.vote_average.toFixed(1)}
                </div>
              </div>

              {/* 장르 태그 */}
              <div className="flex gap-2">
                {getGenreNames(content.genre_ids).map((genre, index) => (
                  <span
                    key={index}
                    className="bg-black w-[3.125rem] overflow-hidden text-ellipsis whitespace-nowrap 
                  text-[0.625rem] text-main/50 text-xs border-[0.0625rem] border-gray02/40 px-1 py-1 rounded-md text-center"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단부 */}
      <div
        className={`flex flex-col justify-center items-center text-gray02 
      pb-[60px] gap-[10px] ${location.pathname === "/" ? "hidden" : ""}`}
      >
        {/* 검색 결과 안내 문구 */}
        <div className="">
          {`${pages}개 페이지에서 ${sortedContents.length}개를 검색하였습니다.`}
        </div>

        {/* 더보기 버튼 */}
        <div
          onClick={() => {
            moreContent();
          }}
          className="cursor-pointer text-gray01"
        >
          더보기
        </div>
      </div>
    </div>
  );
}
