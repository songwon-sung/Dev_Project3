import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_KEY, API_URL, IMAGE_BASE_URL } from "../api/axios";
import axios from "axios";
import noImage from "../assets/noImage/noImage.svg";
import MediaTypeList from "../components/detailContent/MediaTypeList";
import fulledStar from "../assets/star/fulledStar.svg";
import halfStar from "../assets/star/halfStar.svg";
import emptyStar from "../assets/star/emptyStar.svg";
import ContentOverview from "../components/detailContent/ContentOverview";

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
}

interface ActorType {
  id: number;
  name: string;
  profile_path: string;
  popularity: number;
}

interface ImagesType {
  backdrops: { file_path: string }[];
  logos: { file_path: string }[];
  posters: { file_path: string }[];
}

interface VideosType {
  name: string;
  key: string;
  site: string;
}

interface ProvidersType {
  link: string;
  flatrate?: ProviderInfoType[];
  buy?: ProviderInfoType[];
}

interface ProviderInfoType {
  logo_path: string;
  provider_id?: number;
  provider_name: string;
}

export default function DetailContent() {
  const location = useLocation();
  const media = location.pathname.includes("tv") ? "tv" : "movie";
  const contentId = location.pathname.split("/").pop();
  const [contentInfo, setContentInfo] = useState<ContentType>(); // 컨텐츠정보 상태
  const [seasonsInfo, setSeasonsInfo] = useState<SeasonsType[]>([]); // 시즌정보 상태
  const [actors, setActors] = useState<ActorType[]>([]);
  const [images, setImages] = useState<ImagesType>({
    backdrops: [],
    logos: [],
    posters: [],
  });
  const [videos, setVideos] = useState<VideosType[]>([]);
  const [providers, setProviders] = useState<string[][]>([]); // 현재 보여지는 제공사
  const [providersNum, setProvidersNum] = useState<string[][]>([]); // 전체 제공사
  const [pages, setPages] = useState<number>(1);
  const [providerPages, setProvidersPages] = useState<number>(1);
  // console.log(contentId);

  /* 컨텐츠 정보 불러오기 */
  useEffect(() => {
    const fetchContent = async () => {
      const contentDetails = `${media}/${contentId}?api_key=${API_KEY}&language=ko-kr`;
      const watchProviders = `${media}/${contentId}/watch/providers?api_key=${API_KEY}`;

      try {
        const [detailsResponse, providerResponse] = await Promise.all([
          axios.get(`${API_URL}${contentDetails}`),
          axios.get(`${API_URL}${watchProviders}`),
        ]);
        // 데이터 가져오기
        const fetchedContents: ContentType = detailsResponse.data;

        // 시청 제공 데이터 가져오기
        const fetchedProviders: ProvidersType = providerResponse.data.results;

        // movie 시청 제공 데이터(id)
        let providersInfo: string[][] = [];
        if (media === "movie") {
          const countryProviders = Object.values(fetchedProviders).map(
            (result) =>
              result.buy
                ? result.buy
                : result.rent
                ? result.rent
                : result.free
                ? result.free
                : result.flatrate
                ? result.flatrate
                : result.ads
          );
          const buysProviders = countryProviders.map((result) =>
            result.map(
              (value: {
                provider_name: string;
                logo_path: string;
                provider_id: number;
              }) => [value.provider_name, value.logo_path, value.provider_id]
            )
          );
          buysProviders.map((arr) => providersInfo.push(...arr));
        }

        // tv 시청 제공 데이터(id)
        if (media === "tv") {
          const countryProviders = Object.values(fetchedProviders).map(
            (result) =>
              result.buy
                ? result.buy
                : result.rent
                ? result.rent
                : result.free
                ? result.free
                : result.flatrate
                ? result.flatrate
                : result.ads
          );
          const buysProviders = countryProviders.map((result) =>
            result.map(
              (value: {
                provider_name: string;
                logo_path: string;
                provider_id: number;
              }) => [value.provider_name, value.logo_path, value.provider_id]
            )
          );
          buysProviders.map((arr) => providersInfo.push(...arr));
        }

        const providersNumber = Array.from(
          new Map(providersInfo.map((item) => [item.join(), item])).values()
        );

        setProvidersNum(providersNumber);

        const startIdx = (providerPages - 1) * 5;
        const lastIdx = (providerPages - 1) * 5 + 5;
        // 배우 데이터 5개 가져오기
        const fetchedProvidersNumber = providersNumber.slice(startIdx, lastIdx);

        // pages가 1이 되면 초기화
        if (providerPages === 1) {
          setProviders(fetchedProvidersNumber);
        } else {
          setProviders((prev) => [
            ...prev,
            ...fetchedProvidersNumber.filter(
              (providersNumber) =>
                !prev.some((prev) => prev[0] === providersNumber[0])
            ),
          ]);
        }

        setContentInfo(fetchedContents);
        setSeasonsInfo(fetchedContents.seasons || []);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchContent();
  }, [contentId, providerPages]);
  // console.log(contentInfo);
  // console.log(providersNum);
  // console.log(providers);
  // console.log(seasonsInfo);

  /* 배우 정보 불러오기 */
  useEffect(() => {
    const fetchActors = async () => {
      const actorsList = `${media}/${contentId}/${
        media === "tv" ? "aggregate_credits" : "credits"
      }?api_key=${API_KEY}&language=ko-kr`;

      try {
        const [actorsResponse] = await Promise.all([
          axios.get(`${API_URL}${actorsList}`),
        ]);
        const startIdx = (pages - 1) * 8;
        const lastIdx = (pages - 1) * 8 + 8;
        // 배우 데이터 10개 가져오기
        const fetchedActors: ActorType[] = actorsResponse.data.cast.slice(
          startIdx,
          lastIdx
        );

        // pages가 1이 되면 초기화
        if (pages === 1) {
          setActors(fetchedActors);
        } else {
          setActors((prev) => [
            ...prev,
            ...fetchedActors.filter(
              (actor) => !prev.some((prev) => prev.id === actor.id)
            ),
          ]);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchActors();
  }, [contentId, pages]);
  // console.log(actors);

  /* 컨텐츠 이미지 & 영상 정보 불러오기 */
  useEffect(() => {
    const fetchMedias = async () => {
      const imagesList = `${media}/${contentId}/images?api_key=${API_KEY}`;
      const videosList = `${media}/${contentId}/videos?api_key=${API_KEY}&language=ko-KR`;

      try {
        const [imagesResponse, videosResponse] = await Promise.all([
          axios.get(`${API_URL}${imagesList}`),
          axios.get(`${API_URL}${videosList}`),
        ]);
        // 이미지 가져오기
        const fetchedImages: ImagesType = imagesResponse.data;
        const fetchedVideos: VideosType[] = videosResponse.data.results;

        setImages(fetchedImages);
        setVideos(fetchedVideos);
      } catch (error) {
        console.error("Error fetching medias", error);
      }
    };
    fetchMedias();
  }, [contentId]);
  // console.log(videos);
  // console.log(selectedMedia);

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

  // 페이지 로드 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div
      className="w-full min-h-screen h-full mb-[60px] 
        flex flex-col gap-[30px] pt-[58px] text-white"
    >
      {/* 메인 이미지 */}
      <div
        className="w-[30rem] h-[16.875rem] bg-cover bg-center"
        style={{
          backgroundImage: `url(${IMAGE_BASE_URL}original${
            contentInfo?.backdrop_path
              ? contentInfo?.backdrop_path
              : contentInfo?.poster_path
          })`, // 첫 번째 배경 이미지 사용
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
          {contentInfo?.name ? contentInfo?.name : contentInfo?.title}
        </div>

        <div className="flex items-center gap-[0.3125rem]">
          {/* 별점 */}
          <div className="flex gap-0">
            {renderStars(
              contentInfo?.vote_average
                ? Number(contentInfo.vote_average.toFixed(1))
                : 0.0
            )}
          </div>
          {/* 평점 */}
          <div className="text-white">
            {contentInfo?.vote_average
              ? contentInfo.vote_average.toFixed(1)
              : "0.0"}
          </div>
        </div>
      </div>

      {/* 영화 박스 */}
      {media === "movie" && (
        <div
          key={contentId}
          className="w-full h-full flex flex-col gap-[20px] px-[55px]"
        >
          <div
            className="h-fit flex gap-[20px] bg-black/80 px-[20px]
          border-[1px] border-gray02 rounded-[5px]"
          >
            {/* 텍스트 박스 */}
            <div className="flex flex-col justify-between py-[15px] gap-[10px]">
              {/* 상영일자 & 에피소드 갯수 */}
              <div className="flex flex-col justify-center items-start gap-[10px]">
                {/* 상영일자 */}
                <div className="text-[0.875rem] text-gray01">
                  개봉 : {contentInfo?.release_date}
                </div>

                {/* 런타임 */}
                <div className="text-[0.875rem] text-gray01">
                  시간 : {contentInfo?.runtime}분
                </div>
              </div>

              {/* 장르 */}
              <div
                className="w-full overflow-hidden text-ellipsis 
                          flex-wrap flex gap-[5px]"
              >
                {contentInfo?.genres.map((genre) => (
                  <div
                    key={genre.id}
                    className="text-[0.875rem] text-gray01 px-[5px] py-[5px]
                    border-[1px] border-main/50 rounded-[5px]"
                  >
                    {genre.name}
                  </div>
                ))}
              </div>

              {/* 내용 요약 */}
              <div className="text-[0.875rem] text-gray01 leading-5">
                <ContentOverview overview={contentInfo?.overview} />
              </div>

              {/* 방송사 */}
              <div className="w-full flex flex-col gap-[10px]">
                <div className="text-[0.875rem] text-gray01">제작사</div>
                {/* 방송사 로고 및 이름 */}
                {contentInfo?.production_companies?.map((company) => (
                  <div
                    key={company.id}
                    className="flex justify-start items-center gap-[10px]"
                  >
                    {/* 방송사 이름 */}
                    <div className="text-gray01 text-[0.8125rem]">
                      {company.name}
                    </div>

                    {/* 방송사 로고 */}
                    <div
                      className="w-[41px] h-full bg-contain bg-no-repeat bg-center"
                      style={{
                        backgroundImage: `url(${IMAGE_BASE_URL}original${company.logo_path})`,
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 시즌 목록 */}
      <div
        className="w-full h-full flex flex-col gap-[20px] px-[55px]
       transition-all duration-500 ease-out overflow-hidden group-hover:max-h-[300px]"
      >
        {/* 시즌별 박스 */}
        {seasonsInfo &&
          seasonsInfo.map((season) => (
            <Link
              to={`/detail/${media}/${contentId}/${season.id}`}
              key={season.id}
              className="group flex gap-[20px] bg-black/80 border-[1px] 
              border-gray02 rounded-[5px]"
            >
              {/* 이미지 */}
              <div
                className="w-[9.125rem] h-1vh bg-cover bg-center rounded-[5px]"
                style={{
                  backgroundImage: `url(${
                    season.poster_path
                      ? `${IMAGE_BASE_URL}original${season.poster_path}`
                      : `${IMAGE_BASE_URL}original${contentInfo?.backdrop_path}`
                  })`,
                }}
              ></div>

              {/* 텍스트 박스 */}
              <div
                className="w-[12.75rem] flex flex-col justify-between py-[15px] 
                gap-[10px] overflow-hidden text-ellipsis whitespace-nowrap
                group-hover:h-full group-hover:flex-wrap group-hover:whitespace-wrap"
              >
                {/* 제목 */}
                <div
                  className="text-[1.25rem] font-bold group-hover:text-wrap
                  group-hover:h-full group-hover:flex-wrap
                  overflow-hidden text-ellipsis whitespace-wrap"
                >
                  {contentInfo?.name} {season.name}
                </div>

                {/* 상영일자 & 에피소드 갯수 */}
                <div className="flex justify-start items-center gap-[10px]">
                  {/* 상영일자 */}
                  <div className="text-[0.875rem] text-gray01">
                    {season.air_date}
                  </div>

                  {/* 에피소드 갯수 */}
                  <div className="text-[0.875rem] text-gray01">
                    에피소드 {season.episode_count}개
                  </div>
                </div>

                {/* 마우스오버 시 보이는 정보 */}
                <div
                  className="group-hover:w-full group-hover:h-full w-0 h-0
                          bg-black/80 opacity-0 group-hover:opacity-100 
                            flex flex-col justify-start items-center gap-[10px] 
                            rounded-[5px]"
                >
                  {/* 장르 */}
                  <div
                    className="w-full overflow-hidden text-ellipsis 
                            flex-wrap flex gap-[5px]"
                  >
                    {contentInfo?.genres.map((genre) => (
                      <div
                        key={genre.id}
                        className="text-[0.625rem] text-gray01 px-[5px] py-[5px]
                      border-[1px] border-main/50 rounded-[5px]"
                      >
                        {genre.name}
                      </div>
                    ))}
                  </div>
                  {/* 방송사 */}
                  <div className="w-full flex flex-col gap-[10px]">
                    <div className="text-[0.625rem] text-gray01">방송사</div>

                    {/* 방송사 로고 및 이름 */}
                    {contentInfo?.networks?.map((network) => (
                      <div
                        key={network.id}
                        className="flex justify-start items-center gap-[10px]"
                      >
                        {/* 방송사 이름 */}
                        <div className="text-gray01 text-[0.875rem]">
                          {network.name}
                        </div>

                        {/* 방송사 로고 */}
                        <div
                          className="w-[41px] h-full bg-contain bg-no-repeat bg-center"
                          style={{
                            backgroundImage: `url(${IMAGE_BASE_URL}original${network.logo_path})`,
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}

        {/* 구분선 */}
        <div className="w-full border-[1px] border-gray02"></div>

        {/* 시청 제공 */}
        <div className="text-[1.125rem] text-white font-bold">시청 제공</div>

        <div className="flex flex-col gap-[10px]">
          {/* movie */}
          {media === "movie" &&
            providers?.map((provider) => (
              <div
                key={provider[2]}
                className="flex justify-start items-center gap-[10px]"
              >
                {/* 로고 이미지 */}
                <div
                  className="w-[40px] h-[40px] bg-contain bg-center bg-no-repeat 
                rounded-[0.3125rem] border-[1px] border-gray02"
                  style={{
                    backgroundImage: `url(${IMAGE_BASE_URL}original${provider[1]})`,
                  }}
                ></div>
                {/* 제공사 이름 */}
                <div className="w-[310px] flex flex-col overflow-hidden whitespace-wrap">
                  <div className="text-white text-[0.875rem]">
                    {provider[0]}
                  </div>
                </div>
              </div>
            ))}

          {/* tv */}
          {media === "tv" &&
            providers?.map((provider) => (
              <div
                key={provider[2]}
                className="flex justify-start items-center gap-[10px]"
              >
                {/* 로고 이미지 */}
                <div
                  className="w-[40px] h-[40px] bg-contain bg-center bg-no-repeat 
                  rounded-[0.3125rem] border-[1px] border-gray02"
                  style={{
                    backgroundImage: `url(${
                      provider[1]
                        ? `${IMAGE_BASE_URL}original${provider[1]}`
                        : noImage
                    })`,
                  }}
                ></div>
                {/* 제공사 이름 */}
                <div className="w-[310px] flex flex-col overflow-hidden whitespace-wrap">
                  <div className="text-white text-[0.875rem]">
                    {provider[0]}
                  </div>
                </div>
              </div>
            ))}

          {/* 더보기 & 접기 */}
          <div className="flex flex-col justify-between gap-[10px]">
            {providers.length === providersNum.length || (
              <div
                className="text-[0.875rem] text-gray02 text-center 
            font-bold cursor-pointer hover:text-gray01"
                onClick={() => {
                  setProvidersPages((prev) => (prev += 1));
                }}
              >
                더보기
              </div>
            )}

            {providerPages === 1 || (
              <div
                className="text-[0.875rem] text-gray02 text-center 
                font-bold cursor-pointer hover:text-gray01"
                onClick={() => {
                  setProvidersPages(1);
                }}
              >
                접기
              </div>
            )}
          </div>
        </div>

        {/* 구분선 */}
        <div className="w-full border-[1px] border-gray02"></div>

        {/* 출연진 */}
        <div className="text-[1.125rem] text-white font-bold">출연진</div>
        <div className="flex flex-wrap justify-start gap-y-[20px] gap-x-[10px]">
          {actors.map((actor) => (
            <Link
              to={`/detail/person/${actor.id}`}
              key={actor.id}
              className="flex flex-col gap-[5px]"
            >
              {/* 프로필 사진 */}
              <div
                className="w-[85px] h-[85px] bg-cover bg-center rounded-full"
                style={{
                  backgroundImage: `url(${
                    actor.profile_path
                      ? `${IMAGE_BASE_URL}original${actor.profile_path}`
                      : noImage
                  })`,
                }}
              ></div>

              {/* 배우 이름 */}
              <div
                className="w-[85px] text-center text-[0.8125rem]
              overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {actor.name}
              </div>
            </Link>
          ))}
        </div>
        <div className="flex flex-col justify-between gap-[10px]">
          <div
            className="text-[0.875rem] text-gray02 text-center 
            font-bold cursor-pointer hover:text-gray01"
            onClick={() => {
              setPages((prev) => (prev += 1));
            }}
          >
            더보기
          </div>
          {pages === 1 || (
            <div
              className="text-[0.875rem] text-gray02 text-center 
            font-bold cursor-pointer hover:text-gray01"
              onClick={() => {
                setPages(1);
              }}
            >
              접기
            </div>
          )}
        </div>

        {/* 구분선 */}
        <div className="w-full border-[1px] border-gray02"></div>

        {/* 미디어 */}

        {/* 미디어 리스트 */}
        <div className="w-full h-full">
          <MediaTypeList images={images} videos={videos} />
        </div>
      </div>
    </div>
  );
}
