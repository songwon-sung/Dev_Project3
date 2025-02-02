import { useEffect, useState } from "react";
import searchIcon from "../assets/searchIcon.svg";
import { API_KEY, API_URL, IMAGE_BASE_URL } from "../api/axios";
import axios from "axios";
import SearchData from "../components/search/SearchData";
import { Link } from "react-router-dom";

interface SearchDataType {
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

interface CountryType {
  iso_3166_1: string;
  native_name: string;
}

interface GenresType {
  id: number;
  name: string;
}

export default function SearchPage() {
  const [values, setValues] = useState<string>("");
  const [pages, setPages] = useState<number>(1);
  const [searchData, setSearchData] = useState<SearchDataType[]>([]);
  const [genresMap, setGenresMap] = useState<Record<number, string>>({});
  // 검색이 제출되었는지 여부
  const [isSearchSubmitted, setIsSearchSubmitted] = useState<boolean>(false);
  const [debouncedValue, setDebouncedValue] = useState<string>(""); // 디바운싱된 값

  // 입력값 디바운싱 처리 (300ms 후 API 호출)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(values);
    }, 300);

    return () => clearTimeout(timer);
  }, [values]);

  useEffect(() => {
    // 입력값이 디바운싱 처리 되지 않으면 리턴
    if (!debouncedValue) return;

    const fetchSearchData = async () => {
      // multi 검색
      const searchList = `search/multi?api_key=${API_KEY}&query=${values}&inclue_adult=false&language=ko-KR&page=${pages}`;
      // 국가 정보
      const countryList = `watch/providers/regions?api_key=${API_KEY}&language=ko-KR`;
      // tv 장르 정보
      const genresListTv = `genre/tv/list?api_key=${API_KEY}&language=ko-KR`;
      // movie 장르 정보
      const genresListMovie = `genre/movie/list?api_key=${API_KEY}&language=ko-KR`;

      try {
        const searchResponse = await axios.get(`${API_URL}${searchList}`);
        const countryResponse = await axios.get(`${API_URL}${countryList}`);
        const genresTvResponse = await axios.get(`${API_URL}${genresListTv}`);
        const genresMovieResponse = await axios.get(
          `${API_URL}${genresListMovie}`
        );

        const fetchedSearchData = searchResponse.data.results;
        const fetchedCountryData: CountryType[] = countryResponse.data.results;
        const fetchedGenresTvData: GenresType[] = genresTvResponse.data.genres;
        const fetchedGenresMovieData: GenresType[] =
          genresMovieResponse.data.genres;

        // 전체 국가 정보
        const countryMap: Record<string, string> = {};

        fetchedCountryData.forEach((country) => {
          countryMap[country.iso_3166_1] = country.native_name;
        });

        // 전체 장르 정보
        const genreMap: Record<number, string> = {};

        [...fetchedGenresTvData, ...fetchedGenresMovieData].forEach((genre) => {
          genreMap[genre.id] = genre.name;
        });

        // data 내 국가 정보 native_name으로 변경
        const updatedSearchData = fetchedSearchData.map(
          (data: SearchDataType) => ({
            ...data,
            origin_country: data.origin_country?.map(
              (code) => countryMap[code] || code // 매핑된 native_name이 없으면 원래 코드 유지
            ),
            genre_ids: data.genre_ids?.map((id) => genreMap[id] || id),
          })
        );

        setSearchData(updatedSearchData);

        setGenresMap(genreMap);
      } catch (error) {
        console.error("Error fetching contents:", error);
      }
    };

    fetchSearchData();
  }, [debouncedValue, pages]);

  // 엔터 시 새로고침 방지
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 동작인 페이지 새로고침을 막음
    setPages(1); // 페이지 초기화 (첫 번째 페이지로 리셋)
    setIsSearchSubmitted(true); // 검색 제출 상태로 변경
  };
  // console.log(values);

  return (
    <div
      className="w-full min-h-100vh h-full mt-[3.625rem] mb-[5.75rem] p-[0.9375rem]
    flex flex-col gap-[0.9375rem]"
    >
      {/* 검색창 */}
      <div className="w-full h-full flex flex-col items-center gap-[0.625rem]">
        {/* 입력 필드 */}
        <form
          className="w-full flex justify-between"
          onSubmit={handleSearchSubmit}
        >
          <input
            className="w-[25.625rem] h-[1.875rem] rounded-[0.3125rem] bg-black02 p-[0.9375rem]
          text-gray01 text-[0.875rem] border-none focus:outline-none"
            placeholder="검색어를 입력해주세요"
            value={values}
            onChange={(e) => (
              setValues(e.target.value), setIsSearchSubmitted(false)
            )}
          />

          {/* 검색 버튼 */}
          <button className="w-[1.5625rem] h-[1.5625rem]">
            <img src={searchIcon} alt="search button" />
          </button>
        </form>

        {/* 엔터를 치지 않았을 때만 보이기 */}
        {isSearchSubmitted || !values || (
          <div className="flex flex-col gap-[1.25rem]">
            {/* 검색창 입력 중인 상태 */}
            {searchData?.slice(0, 5).map((data) => (
              <Link
                to={`/detail/${data.media_type}/${data.id}`}
                key={data.id}
                className="w-[23.125rem] h-fit bg-black02/40 rounded-[0.3125rem] 
                gap-[0.625rem] flex justify-between"
              >
                {/* 썸네일 이미지 */}
                <div
                  className="w-[9.125rem] h-[4.625rem] bg-gray01 rounded-[0.3125rem]
                bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${IMAGE_BASE_URL}original${
                      data.media_type !== "person"
                        ? `${data.poster_path}`
                        : `${data.profile_path}`
                    })`,
                  }}
                ></div>

                {/* 컨텐츠 정보란 */}
                <div
                  className="w-[18.375rem] p-[0.3125rem]
                flex flex-col justify-between items-start"
                >
                  {/* 컨텐츠 제목 */}
                  <div
                    className="w-[14.4475rem] text-white text-[1rem]
                  overflow-hidden whitespace-nowrap text-ellipsis"
                  >
                    {data.name ? data.name : data.title}
                  </div>

                  {/* 추가 정보 1 */}
                  <div
                    className="w-full text-gray01 flex justify-between
                  items-baseline"
                  >
                    {/* 개봉일자 or 첫 방송일 */}
                    <div className="text-[0.8125rem]">
                      {data.first_air_date
                        ? data.first_air_date
                        : data.release_date}
                    </div>

                    {/* 국가 */}
                    <div className="text-[0.8125rem]">
                      {data.origin_country?.join(", ")}
                    </div>

                    {/* 평점 */}
                    <div className="text-[0.8125rem]">
                      {data.media_type !== "person" &&
                        `평점 ${data.vote_average?.toFixed(1)}`}
                    </div>
                  </div>

                  {/* 추가 정보 2 */}
                  <div
                    className="w-full text-gray01 flex justify-between
                    items-baseline"
                  >
                    {/* 미디어 타입 */}
                    <div className="text-[0.8125rem]">
                      {data.media_type.toLocaleUpperCase()}
                    </div>

                    {/* 장르 태그 */}
                    <div
                      className="flex gap-[0.3125rem] 
                      overflow-hidden"
                    >
                      {data.genre_ids?.slice(0, 2).map((genre) => (
                        <div
                          key={genre}
                          className="bg-black/20
                          overflow-hidden text-ellipsis whitespace-nowrap 
                          text-[0.625rem] text-center text-main/70 border-[0.0625rem] 
                          border-black02 p-[0.3125rem] rounded-[0.3125rem]"
                        >
                          {genre}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 엔터쳤을 때만 보이기 */}

        {isSearchSubmitted && (
          <div
            className="w-full h-fit flex flex-col justify-start
            items-center mt-[2.5rem] gap-[2.5rem]"
          >
            {/* TV */}
            <SearchData media="tv" value={values} />

            {/* 구분선 */}
            <div className="w-[23.75rem] border-[0.0625rem] border-gray02"></div>

            {/* MOVIE */}
            <SearchData media="movie" value={values} />

            {/* 구분선 */}
            <div className="w-[23.75rem] border-[0.0625rem] border-gray02"></div>

            {/* PERSON */}
            <SearchData media="person" value={values} />
          </div>
        )}
      </div>
    </div>
  );
}
