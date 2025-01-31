import React, { useEffect, useState } from "react";
import { API_KEY, API_URL, IMAGE_BASE_URL } from "../api/axios";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ContentOverview from "../components/detailContent/ContentOverview";
import fulledStar from "../assets/star/fulledStar.svg";
import halfStar from "../assets/star/halfStar.svg";
import emptyStar from "../assets/star/emptyStar.svg";

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
  // console.log(seasonsInfo);

  /* 컨텐츠 정보 불러오기 */
  useEffect(() => {
    const fetchContent = async () => {
      const contentDetails = `${media}/${contentId}?api_key=${API_KEY}&language=ko-KR`;

      try {
        const [detailsResponse] = await Promise.all([
          axios.get(`${API_URL}${contentDetails}`),
        ]);
        // 데이터 가져오기
        const fetchedContents: ContentType = detailsResponse.data;
        const fetchedSeasons = detailsResponse.data.seasons.find(
          (season: SeasonsType) => season.id === seasonId
        );

        setContentInfo(fetchedContents);
        setSeasonsInfo(fetchedSeasons);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchContent();
  }, [contentId]);

  useEffect(() => {
    if (!seasonsInfo) return;

    const fetchEpisodes = async () => {
      const seasonDetails = `${media}/${contentId}/season/${seasonsInfo?.season_number}?api_key=${API_KEY}&language=ko-KR`;

      try {
        const [episodesResponse] = await Promise.all([
          axios.get(`${API_URL}${seasonDetails}`),
        ]);
        // 데이터 가져오기
        const fetchedEpisodes: EpisodesType[] = episodesResponse.data.episodes;
        console.log(fetchedEpisodes);

        setEpisodes(fetchedEpisodes);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchEpisodes();
  }, [seasonsInfo]);

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
      <div
        className="w-full h-full flex flex-col gap-[20px] px-[55px]
       transition-all duration-500 ease-out overflow-hidden group-hover:max-h-[300px]"
      >
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

        {/* 에피소드 목록 */}
        {episodes.map((episode) => (
          <div
            key={episode.id}
            className="relative flex justify-between items-center
            bg-gradient-to-r to-balck from-gray01/20 rounded-[0.3125rem]
            p-[0.3125rem]"
          >
            {/* 에피소드 넘버 */}
            <div className="w-[3.125rem] text-[2.5rem] text-center text-main/40">
              {episode.episode_number}
            </div>

            {/* 스틸컷 */}
            <div
              className="w-[6.25rem] h-[4.375rem] bg-cover bg-center rounded-[0.3125rem]"
              style={{
                backgroundImage: `url(${IMAGE_BASE_URL}original${episode.still_path})`,
              }}
            ></div>

            {/* 세부 내용 */}
            <div className="w-[12.5rem] h-[4.375rem] flex flex-col justify-between">
              {/* 제목 및 런타임 */}
              <div className="flex justify-start items-baseline gap-[0.625rem]">
                {/* 제목 */}
                <div className="text-[0.9375rem] text-white">
                  {episode.name}
                </div>

                {/* 런타임 */}
                <div className="text-[0.6875rem] text-gray01">
                  {episode.runtime}분
                </div>

                {/* 런타임 */}
                <div className="text-[0.6875rem] text-gray01">
                  {episode.vote_average.toFixed(1)}점
                </div>
              </div>

              {/* 요약 내용 */}
              <div className="w-[12.5rem] h-[2.75rem] leading-4 overflow-hidden text-ellipsis line-clamp-3 text-[0.6875rem] text-gray01">
                {episode.overview}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
