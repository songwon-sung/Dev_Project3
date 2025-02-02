import React, { useCallback, useEffect, useRef, useState } from "react";
import { API_KEY, API_URL, IMAGE_BASE_URL } from "../api/axios";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ContentOverview from "../components/detailContent/ContentOverview";
import fulledStar from "../assets/star/fulledStar.svg";
import halfStar from "../assets/star/halfStar.svg";
import emptyStar from "../assets/star/emptyStar.svg";
import seasonSelect from "../assets/arrow/seasonSelect.svg";
import seasonSelectDone from "../assets/arrow/seasonSelectDone.svg";
import noImage from "../assets/noImage/noImage.svg";

interface ContentType {
  backdrop_path: string;
  poster_path: string;
  name?: string;
  title?: string;
  overview: string;
  seasons: SeasonsType[];
  genres: { id: number; name: string }[];
  networks?: { id: number; logo_path: string; name: string }[];
  production_companies?: { id: number; logo_path: string; name: string }[];
  release_date?: string;
  runtime?: number;
  vote_average: number;
}

interface SeasonsType {
  air_date: string;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  episode_count: number;
  season_number: number;
  vote_average: number;
}

interface EpisodesType {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  runtime: number;
  still_path: string;
  vote_average: number;
}

export default function DetailEpisode() {
  const location = useLocation();
  const dataLocation = location.pathname.split("/");
  const media = dataLocation[2].includes("tv") ? "tv" : "movie";
  const contentId = dataLocation[3];
  const seasonId = Number(dataLocation[4]);
  const [contentInfo, setContentInfo] = useState<ContentType>();
  const [seasonsInfo, setSeasonsInfo] = useState<SeasonsType>();
  const [episodes, setEpisodes] = useState<EpisodesType[]>([]);
  const [selectSeason, setSelectSeason] = useState(false); // 시즌토글선택유무
  const [page, setPage] = useState<number>(1); // 데이터 페이지
  const [remainRoad, setRemainRoad] = useState(true); // 남은데이터유무
  const [prevSeason, setPrevSeason] = useState<string>(""); // 이전시즌이름
  // console.log(seasonsInfo);

  /* 컨텐츠 정보 불러오기 */
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}${media}/${contentId}?api_key=${API_KEY}&language=ko-KR`
        );
        const selectedSeason = data.seasons.find(
          (season: SeasonsType) => season.id === seasonId
        );

        setContentInfo(data);
        setSeasonsInfo(selectedSeason);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchContent();
  }, [contentId, seasonId]);
  // console.log(contentInfo);
  // console.log(page);

  /* 에피소드 불러오기 */
  useEffect(() => {
    if (!seasonsInfo) return;

    const fetchEpisodes = async () => {
      const seasonDetails = `${media}/${contentId}/season/${seasonsInfo?.season_number}?api_key=${API_KEY}&language=ko-KR`;

      try {
        const [episodesResponse] = await Promise.all([
          axios.get(`${API_URL}${seasonDetails}`),
        ]);
        // console.log(seasonsInfo.name);
        // console.log(prevSeason);
        // console.log(page);

        // 이전 시즌이름과 현재 시즌이름이 같지 않으면 page 1
        {
          seasonsInfo.name !== prevSeason && setPage(1);
        }

        // 처음과 끝 인덱스 번호
        const startIdx = (page - 1) * 20;
        const lastIdx = (page - 1) * 20 + 20;

        // 데이터 20개씩 넣기
        const sliceEpisodes = episodesResponse.data.episodes.slice(
          startIdx,
          lastIdx
        );

        // 데이터 길이 가져오기
        const episodeLength = episodesResponse.data.episodes.length;

        // 데이터의 마지막 인덱스가 범위 안에 있으면 더보기 없애기
        if (episodeLength - 1 <= lastIdx) {
          setRemainRoad(false);
        } else {
          setRemainRoad(true);
        }

        // console.log(episodeLength);
        // console.log(startIdx);
        // console.log(lastIdx);
        // console.log(remainRoad);
        // console.log(fetchedEpisodes.slice(0, 7));

        // 시작인덱스가 0이면 불러온 에피소드 데이터 바로 집어넣기
        if (startIdx === 0) {
          setEpisodes(sliceEpisodes);
        } else {
          // 시작인덱스가 0이 아니면 이전 에피소드에 추가하기
          setEpisodes((prevEpisodes) => [
            ...prevEpisodes,
            ...sliceEpisodes.filter(
              (newEpisode: EpisodesType) =>
                !prevEpisodes.some(
                  (existingEpisode) => existingEpisode.id === newEpisode.id
                )
            ),
          ]);
        }
        setPrevSeason(seasonsInfo.name);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchEpisodes();
  }, [seasonsInfo, page]);

  /* 시즌선택 함수 */
  const selectContentSeason = (selectedSeasonId: number) => {
    const selectedSeason = contentInfo?.seasons.find(
      (season: SeasonsType) => season.season_number === selectedSeasonId
    );
    setSeasonsInfo(selectedSeason);
  };

  /* 별점 표시 */
  const renderStars = (rating: number) => {
    const filledStars = Math.floor(rating / 2); // 채워진 별의 수
    const halfStars = (rating / 2) % 1 !== 0; // 반별 여부
    const emptyStars = 5 - Math.ceil(rating / 2); // 빈 별의 수

    const stars = [];

    // 채워진 별
    for (let i = 0; i < filledStars; i++) {
      stars.push(
        <img
          key={`filled-${i}`}
          src={fulledStar}
          alt="filled star"
          className="w-[20px] h-[16px]"
        />
      );
    }

    // 반별
    if (halfStars) {
      stars.push(
        <img
          key="half-star"
          src={halfStar}
          alt="half star"
          className="w-[20px] h-[16px]"
        />
      );
    }

    // 빈 별
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <img
          key={`empty-${i}`}
          src={emptyStar}
          alt="empty star"
          className="w-[20px] h-[16px]"
        />
      );
    }

    return stars;
  };

  // console.log(contentInfo);
  // console.log(seasonsInfo);
  // console.log(episodes);

  // 페이지 로드 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="w-full min-h-screen h-full mb-[60px] 
      flex flex-col gap-[30px] pt-[58px] text-white"
    >
      {/* 메인 이미지 */}
      <div
        className="w-[30rem] h-[16.875rem]"
        style={{
          backgroundImage: `url(${IMAGE_BASE_URL}original${contentInfo?.backdrop_path})`, // 첫 번째 배경 이미지 사용
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* 검정 오버레이 및 제목, 요약 */}
      <div
        className="absolute w-[30rem] h-[16.875rem] 
            bg-gradient-to-b from-black/0 to-black/100
            px-[40px] gap-[10px] flex flex-col justify-end"
      >
        {/* 제목 */}
        <div className="text-[1.875rem] font-bold">
          {contentInfo?.name
            ? `${contentInfo?.name} ${seasonsInfo?.name}`
            : contentInfo?.title}
        </div>

        {/* 별점 및 평점 */}
        <div className="flex items-center gap-[0.3125rem]">
          {/* 별점 */}
          <div className="flex gap-0">
            {renderStars(
              seasonsInfo?.vote_average
                ? Number(seasonsInfo.vote_average.toFixed(1))
                : 0.0
            )}
          </div>
          {/* 평점 */}
          <div className="text-white">
            {seasonsInfo?.vote_average
              ? seasonsInfo.vote_average.toFixed(1)
              : "0.0"}
          </div>
        </div>

        {/* 내용 요약 */}
        <ContentOverview overview={seasonsInfo?.overview} />
      </div>

      {/* 세부 정보 */}
      <div className="w-full h-full flex flex-col  gap-[20px] px-[55px]">
        <div className="flex justify-between items-start">
          {/* 상영일자 & 에피소드 갯수 */}
          <div className="flex flex-col justify-center items-start gap-[10px]">
            {/* 상영일자 */}
            <div className="text-[0.875rem] text-gray01">
              공개 : {seasonsInfo?.air_date}
            </div>

            {/* 에피소드 갯수 */}
            <div className="text-[0.875rem] text-gray01">
              에피소드 {seasonsInfo?.episode_count}개
            </div>
          </div>

          {/* 시즌 선택 토글 */}
          <div className="w-[8.125rem] flex flex-col gap-[10px]">
            <div
              className="flex justify-between
              p-[0.625rem] bg-gray02 rounded-[0.3125rem] cursor-pointer"
              onClick={() => setSelectSeason((prev) => !prev)}
            >
              <div className="text-[0.875rem] text-white w-[5.625rem]">
                {seasonsInfo?.name}
              </div>

              <img
                src={!selectSeason ? `${seasonSelect}` : `${seasonSelectDone}`}
                alt="season select"
              />
            </div>
            {selectSeason &&
              contentInfo?.seasons.map((season) => (
                <div
                  key={season.id}
                  className="flex justify-between items-start
                  px-[0.3125rem] group cursor-pointer"
                  onClick={() => {
                    selectContentSeason(season.season_number);
                    setSelectSeason((prev) => !prev);
                  }}
                >
                  <div
                    className="text-[0.8125rem] text-gray02 w-[80px] h-[1.625rem]
                    group-hover:text-gray01 overflow-hidden 
                    text-ellipsis whitespace-wrap
                    group-hover:h-full"
                  >
                    {season.name}
                  </div>
                  <div
                    className="text-[0.625rem] text-gray02 text-right
                  group-hover:text-gray01 w-[2.5rem] text-wrap"
                  >
                    에피소드 {season.episode_count}개
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 에피소드 목록 */}
        {episodes.map((episode) => (
          <div
            key={episode.id}
            className="w-full h-full flex justify-between items-center
            bg-gradient-to-r to-balck from-gray01/20 
            rounded-[0.3125rem] p-[0.3125rem] gap-[0.625rem]
            overflow-hidden
            group"
          >
            {/* 에피소드 넘버 */}
            <div className="w-[3.125rem] text-[1.875rem] text-center text-main/40">
              {episode.episode_number}
            </div>

            <div
              className="w-[19.375rem] flex justify-between group-hover:flex-col
            group-hover:gap-[0.625rem]"
            >
              {/* 스틸컷 */}
              <div
                className="w-[6.25rem] h-[4.375rem] bg-cover bg-center 
                rounded-[0.3125rem] 
                group-hover:w-[19.375rem] group-hover:h-[7.5rem]"
                style={{
                  backgroundImage: `url(${
                    episode.still_path
                      ? `${IMAGE_BASE_URL}original${episode.still_path}`
                      : `${IMAGE_BASE_URL}original${contentInfo?.poster_path}`
                  })`,
                }}
              ></div>

              {/* 세부 내용 */}
              <div
                className="w-[12rem] h-[4.375rem] flex flex-col justify-between
              overflow-hidden gap-[0.3125rem]
              group-hover:w-[19.375rem] group-hover:h-full"
              >
                {/* 제목 및 런타임 */}
                <div className="flex flex-col justify-between items-start gap-[0.625rem]">
                  {/* 제목 */}
                  <div
                    className="text-[0.9375rem] text-white 
                overflow-hidden text-ellipsis line-clamp-1"
                  >
                    {episode.name}
                  </div>

                  <div className="w-full flex justify-between">
                    {/* 방영일자 */}
                    <div
                      className="text-[0.6875rem] text-gray01
                    group-hover:text-[0.875rem]"
                    >
                      {episode.air_date ? episode.air_date : "- "}
                    </div>

                    {/* 런타임 */}
                    <div
                      className="text-[0.6875rem] text-gray01
                    group-hover:text-[0.875rem]"
                    >
                      {episode.runtime ? episode.runtime : "- "}분
                    </div>

                    {/* 평점 */}
                    <div
                      className="text-[0.6875rem] text-gray01
                    group-hover:text-[0.875rem]"
                    >
                      {episode.vote_average.toFixed(1)}점
                    </div>
                  </div>
                </div>

                {/* 요약 내용 */}
                <div
                  className="w-[12rem] h-[2.75rem] leading-4 
                overflow-hidden text-ellipsis line-clamp-2 text-[0.6875rem] 
                text-gray01 group-hover:line-clamp-none
                group-hover:w-[19.375rem] group-hover:h-full"
                >
                  {episode.overview}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* 더보기 */}
        {remainRoad && (
          <div
            className="w-full text-center text-gray02 font-bold cursor-pointer
          hover:text-gray01"
            onClick={() => {
              setPage((prev) => (prev += 1));
            }}
          >
            더보기
          </div>
        )}
      </div>
    </div>
  );
}
