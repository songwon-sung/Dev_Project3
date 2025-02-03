import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API_KEY, API_URL, IMAGE_BASE_URL } from "../api/axios";
import axios from "axios";

interface PersonDataType {
  birthday: string;
  deathday?: string;
  gender: number;
  homepage: string;
  id: number;
  name: string;
  profile_path: string;
  place_of_birth: string;
}

interface PersonImgType {
  file_path: string;
}

interface CreditsType {
  backdrop_path: string;
  poster_path: string;
  id: number;
  title?: string;
  name?: string;
  genre_ids?: number[];
  popularity: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  media_type: string;
  adult: boolean;
  vote_average: number;
  origin_country?: string[];
  profile_path?: string;
}

export default function DetailPerson() {
  const [personData, setPersonData] = useState<PersonDataType>();
  const [personImg, setPersonImg] = useState<PersonImgType[]>([]);
  const [tvCredits, setTvCredits] = useState<CreditsType[]>([]);
  const [movieCredits, setMovieCredits] = useState<CreditsType[]>([]);
  const location = useLocation(); // 현재 url
  const personId = location.pathname.replace("/detail/person/", ""); // id정보
  const [contTvPages, setContTvPages] = useState<number>(1);
  const [contMoviePages, setContMoviePages] = useState<number>(1);
  // console.log(personId);

  useEffect(() => {
    const fetchPersonInfo = async () => {
      // 인물 정보
      const personInfoList = `person/${personId}?api_key=${API_KEY}&language=ko-KR`;
      // 인물 이미지
      const personImgList = `person/${personId}/images?api_key=${API_KEY}`;
      // 출연작 tv
      const tvCreditList = `person/${personId}/tv_credits?api_key=${API_KEY}&language=ko-KR`;
      // 출연작 movie
      const movieCreditList = `person/${personId}/movie_credits?api_key=${API_KEY}&language=ko-KR`;

      try {
        const [
          personInfoResponse,
          personImgResponse,
          tvCreditResponse,
          movieCreditResponse,
        ] = await Promise.all([
          axios.get(`${API_URL}${personInfoList}`),
          axios.get(`${API_URL}${personImgList}`),
          axios.get(`${API_URL}${tvCreditList}`),
          axios.get(`${API_URL}${movieCreditList}`),
        ]);

        const fetchedPersonInfo = personInfoResponse.data;
        const fetchedPersonImg = personImgResponse.data.profiles;
        const fetchedTvCredits = tvCreditResponse.data.cast;
        const fetchedMovieCredits = movieCreditResponse.data.cast;
        // console.log(fetchedPersonImg);

        setPersonData(fetchedPersonInfo);
        setPersonImg(fetchedPersonImg);
        setTvCredits(fetchedTvCredits);
        setMovieCredits(fetchedMovieCredits);
      } catch (error) {
        console.error("Error fetching person data", error);
      }
    };
    fetchPersonInfo();
  }, [personId]);
  console.log(movieCredits);

  return (
    <div
      className="w-full min-h-screen h-full mb-[60px] 
    flex flex-col gap-[30px] pt-[58px] px-[55px] text-white"
    >
      {/* 인물 정보 */}
      <div className="text-gray01 font-light flex justify-between">
        {/* 인물 이미지 */}
        <div
          className="w-[370px] h-[500px] bg-cover bg-center"
          style={{
            backgroundImage: `url(${IMAGE_BASE_URL}original${personData?.profile_path})`,
          }}
        >
          {/* 검정 오버레이 */}
          <div
            className="w-full h-full bg-gradient-to-t from-black/100 to-black/0
          flex flex-col justify-end gap-[1.25rem]"
          >
            {/* 이름 */}
            <div className="text-[2.5rem] font-bold text-white ">
              {personData?.name}
            </div>

            {/* 생년월일 */}
            <div className="text-[0.875rem]">
              생년월일 :{" "}
              {personData?.birthday
                .replace("-", "년 ")
                .replace("-", "월 ")
                .padEnd(13, "일")}
            </div>

            {/* 출생 */}
            <div className="text-[0.875rem]">
              출생 : {personData?.place_of_birth}
            </div>

            {/* 성별 */}
            <div className="text-[0.875rem]">
              성별 :{" "}
              {personData?.gender === 2
                ? "남자"
                : personData?.gender === 1
                ? "여자"
                : "알 수 없음"}
            </div>

            {/* 홈페이지 */}
            <a
              href={personData?.homepage}
              target="_black"
              rel="noopener noreferrer"
              className="text-[0.875rem]"
            >
              홈페이지 : {personData?.homepage}
            </a>
          </div>
        </div>
      </div>

      {/* 출연작 */}
      <div className="flex flex-col gap-[1.875rem]">
        <div className="text-[1.5625rem] font-bold text-center">출연작</div>

        {/* TV */}
        <div className="text-[1.25rem] font-bold">TV</div>
        <div
          className="flex justify-start overflow-hidden flex-wrap
          gap-x-[1.25rem] gap-y-[0.625rem]"
        >
          {tvCredits.slice(0, contTvPages * 6).map((data) => (
            <div
              key={data.id}
              className="w-[6.875rem] flex flex-col justify-between items-center
              flex-wrap gap-[0.625rem] group"
            >
              {/* 출연작 이미지 */}
              <div
                className="w-[6.875rem] h-[8.625rem] rounded-[0.3125rem] 
                bg-cover bg-center border-[0.0625rem] border-gray02"
                style={{
                  backgroundImage: `url(${IMAGE_BASE_URL}original${
                    data.backdrop_path ? data.backdrop_path : data.poster_path
                  })`,
                }}
              ></div>
              {/* 출연작 제목 */}
              <div
                className="w-[6.875rem] text-[0.8125rem] overflow-hidden 
                text-ellipsis whitespace-nowrap group-hover:text-wrap text-justify
                text-gray01"
              >
                {data.name}
              </div>
            </div>
          ))}
        </div>

        {/* 검색결과 없을 경우 안내문구 */}
        <div className="text-center text-gray02">
          {movieCredits.length === 0 && "검색 결과가 없습니다."}
        </div>

        {/* 더보기 접기 버튼 */}
        <div
          className="flex flex-col justify-between items-center gap-[0.625rem]
         cursor-pointer"
        >
          {tvCredits.slice(0, contTvPages * 6).length !== tvCredits.length && (
            <button
              className="text-gray02 hover:text-gray01"
              onClick={() => {
                setContTvPages((prev) => prev + 1);
              }}
            >
              더보기
            </button>
          )}
          {contTvPages !== 1 && (
            <div
              className="text-gray02 cursor-pointer hover:text-gray01"
              onClick={() => {
                setContTvPages(1);
              }}
            >
              접기
            </div>
          )}
        </div>

        {/* 구분선 */}
        <div className="w-[23.75rem] border-[0.0625rem] border-gray02"></div>

        {/* MOVIE */}
        <div className="text-[1.25rem] font-bold">MOVIE</div>
        <div
          className="flex justify-start overflow-hidden flex-wrap
          gap-x-[1.25rem] gap-y-[0.625rem]"
        >
          {movieCredits.slice(0, contMoviePages * 6).map((data) => (
            <div
              key={data.id}
              className="w-[6.875rem] flex flex-col justify-between items-start
              flex-wrap gap-[0.625rem] group"
            >
              {/* 출연작 이미지 */}
              <div
                className="w-[6.875rem] h-[8.625rem] rounded-[0.3125rem] 
                bg-cover bg-center border-[0.0625rem] border-gray02"
                style={{
                  backgroundImage: `url(${IMAGE_BASE_URL}original${
                    data.backdrop_path ? data.backdrop_path : data.poster_path
                  })`,
                }}
              ></div>
              {/* 출연작 제목 */}
              <div
                className="w-[6.875rem] text-[0.8125rem] overflow-hidden 
                text-ellipsis whitespace-nowrap group-hover:text-wrap text-left
                text-gray01"
              >
                {data.title}
              </div>
            </div>
          ))}
        </div>

        {/* 검색결과 없을 경우 안내문구 */}
        <div className="text-center text-gray02">
          {movieCredits.length === 0 && "검색 결과가 없습니다."}
        </div>

        {/* 더보기 접기 버튼 */}
        <div
          className="flex flex-col justify-between items-center gap-[0.625rem]
         cursor-pointer"
        >
          {movieCredits.slice(0, contMoviePages * 6).length !==
            movieCredits.length && (
            <button
              className="text-gray02 hover:text-gray01"
              onClick={() => {
                setContMoviePages((prev) => prev + 1);
              }}
            >
              더보기
            </button>
          )}
          {contMoviePages !== 1 && (
            <div
              className="text-gray02 cursor-pointer hover:text-gray01"
              onClick={() => {
                setContMoviePages(1);
              }}
            >
              접기
            </div>
          )}
        </div>
      </div>

      {/* 이미지 */}
    </div>
  );
}
