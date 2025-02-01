import { useEffect, useMemo, useState } from "react";
import { API_KEY, API_URL, IMAGE_BASE_URL } from "../../api/axios";
import axios from "axios";
import noImage from "../../assets/noImage/noImage.svg";
import { Link } from "react-router-dom";

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

interface ContentsArrayProps {
  media: string;
  selectedGenres: string[];
  selectedSort: string;
}

export default function ContentsArray(props: ContentsArrayProps) {
  const [contents, setContents] = useState<ContentsType[]>([]);
  const [genres, setGenres] = useState<GenreType[]>([]);
  const [pages, setPages] = useState<number>(1);

  const selectedGenreIds = genres
    .filter((genre) => props.selectedGenres.includes(genre.name))
    .map((genre) => genre.id);

  // 영화 더 불러오기
  const moreContent = () => {
    setPages((prev) => prev + 1);
  };

  // 페이지 로드 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* 데이터 불러오기 */
  useEffect(() => {
    const media = props.media === "tv" ? "tv" : "movie";

    const fetchContents = async () => {
      const contentsList = `${media}/popular?api_key=${API_KEY}&language=ko-kr&page=${pages}`;
      const genresList = `genre/${media}/list?api_key=${API_KEY}&language=ko-kr`;

      try {
        const [contentsResponse, genresResponse] = await Promise.all([
          axios.get(`${API_URL}${contentsList}`),
          axios.get(`${API_URL}${genresList}`),
        ]);
        const fetchedContents: ContentsType[] = contentsResponse.data.results;
        // console.log(contents);

        // 컨텐츠 중복 검사
        if (contentsResponse.data && contentsResponse.data.results) {
          setContents((prevContents) => [
            ...prevContents,
            ...fetchedContents.filter(
              (content) =>
                !prevContents.some(
                  (prevContent) => prevContent.id === content.id
                )
            ),
          ]);
        } else {
          console.error("Contents data not found");
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

  /* 해당되는 장르의 컨텐츠만 분류 */
  const filteredContents = contents.filter(
    (content) =>
      props.selectedGenres.length === 0 ||
      content.genre_ids.some((id) => selectedGenreIds.includes(id))
  );

  /* 선택된 정렬에 따라 정렬하기 */
  const sortedContents = useMemo(() => {
    switch (props.selectedSort) {
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
  // console.log(sortedContents);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-[1.875rem]">
      <div className="w-[23.125rem] flex flex-wrap justify-start items-start gap-x-[1.25rem] gap-y-[2.5rem]">
        {/* 세부컨텐츠 */}
        {sortedContents.map((content) => (
          <div
            key={content.id}
            className="flex flex-col justify-between gap-y-[0.625rem]"
          >
            {/* 컨텐츠 이미지 */}
            <Link
              to={`/detail/${props.media}/${content.id}`}
              className="w-[6.875rem] h-[8.625rem] bg-cover border-[0.0625rem] 
              border-gray02 rounded-[5px]"
              style={{
                backgroundImage: `url(${
                  content.poster_path
                    ? `${IMAGE_BASE_URL}original${content.poster_path}`
                    : noImage
                })`,
              }}
            ></Link>

            {/* 컨텐츠 제목 */}
            <div
              className="w-[6.875rem] text-gray01 font-bold text-[1rem]
                      overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {content.title || content.name}
            </div>

            {/* 컨텐츠 세부 정보 */}
            <div className="flex justify-between font-bold text-gray02">
              {/* 컨텐츠 개봉일자 */}
              <div className="text-[0.8125rem]">
                {content.release_date
                  ? content.release_date.slice(2).replaceAll("-", "/")
                  : content.first_air_date?.slice(2).replaceAll("-", "/")}
              </div>
              {/* 컨텐츠 평점 */}
              <div className="text-[0.8125rem]">
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
        ))}
      </div>
      <div className="text-gray02">
        {`${pages}개 페이지에서 ${sortedContents.length}개를 검색하였습니다.`}
      </div>
      <div className="text-gray02">
        <div
          onClick={() => {
            moreContent();
          }}
          className="cursor-pointer"
        >
          더보기
        </div>
      </div>
    </div>
  );
}
