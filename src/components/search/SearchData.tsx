import { useEffect, useState } from "react";
import { API_KEY, API_URL, IMAGE_BASE_URL } from "../../api/axios";
import axios from "axios";
import { Link } from "react-router-dom";

interface SearchDataProps {
  media: string;
  value: string;
}

interface SearchedDataType {
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
  gender: number;
}

export default function SearchData(props: SearchDataProps) {
  const [searchedData, setSearchedData] = useState<SearchedDataType[]>([]); // 데이터
  const [pages, setPages] = useState<number>(1); // 현재 데이터 페이지
  const [contPages, setContPages] = useState<number>(1);
  const [totalDataNum, setTotalDataNum] = useState<number>(0); // 데이터 총 수
  const [debouncedValue, setDebouncedValue] = useState<string>(""); // 디바운싱 상태
  const [prevProps, setPrevProps] = useState<SearchDataProps>();

  // 입력값 디바운싱 처리 (300ms 후 API 호출)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(props.value);
    }, 300);

    return () => clearTimeout(timer);
  }, [props.value]);

  useEffect(() => {
    // 입력값이 디바운싱 처리 되지 않으면 리턴
    if (!debouncedValue) return;

    // 입력값이 이전과 다르면 초기화
    if (prevProps !== props) {
      setSearchedData([]);
    }

    const fetchSearchData = async () => {
      const searchDataList = `search/${props.media}?api_key=${API_KEY}&query=${props.value}&include_adult=false&language=ko-KR&page=${pages}`;

      try {
        const searchResponse = await axios.get(`${API_URL}${searchDataList}`);
        const fetchedSearchResponse = searchResponse.data.results;
        const totalDataNumresponse = searchResponse.data.total_results;

        console.log(totalDataNumresponse);

        // setSearchedData(fetchedSearchResponse);

        setSearchedData((prev) => [
          ...prev,
          ...fetchedSearchResponse.filter(
            (newData: SearchedDataType) =>
              !prev.some((exist) => exist.id === newData.id)
          ),
        ]);
        setTotalDataNum(totalDataNumresponse);
      } catch (error) {
        console.error("Error fetching searching data"), error;
      }
    };

    fetchSearchData();
  }, [props.media, debouncedValue, pages]);
  console.log("보이는 수", searchedData.slice(0, contPages * 6).length);

  return (
    <div className="w-full h-full">
      <div className="w-full h-full px-[2.1875rem] flex flex-col gap-[1.875rem]">
        {/* 콘텐츠 주제 */}
        <div className="text-white text-[1.875rem]">
          {props.media.toUpperCase()}
        </div>

        {/* 컨텐츠 */}
        <div className="flex justify-start flex-wrap gap-[1.25rem]">
          {searchedData.slice(0, contPages * 6).map((data) => (
            <div
              key={data.id}
              className="w-[6.875rem] flex flex-col gap-[0.625rem] group"
            >
              {/* 이미지 */}
              <Link
                to={`/detail/${props.media}/${data.id}`}
                className="w-[6.875rem] h-[8.625rem] rounded-[0.3125rem] 
                bg-cover bg-center border-[0.0625rem] border-gray02"
                style={{
                  backgroundImage: `url(${IMAGE_BASE_URL}original${
                    data.backdrop_path
                      ? data.backdrop_path
                      : data.poster_path
                      ? data.poster_path
                      : data.profile_path
                  })`,
                }}
              ></Link>
              {/* 컨텐츠 정보 */}
              <div className="w-full flex flex-col gap-[0.125rem]">
                {/* 제목 or 이름 */}
                <div
                  className="text-[1rem] text-gray01 font-bold 
                  whitespace-nowrap group-hover:text-wrap
                  text-ellipsis overflow-hidden"
                >
                  {data.name ? data.name : data.title}
                </div>

                {/* 상영연도 & 평점 */}
                {props.media !== "person" && (
                  <div className="flex justify-between text-gray02">
                    <div className="text-[0.8125rem]">
                      {data.first_air_date
                        ? data.first_air_date
                        : data.release_date}
                    </div>
                    <div className="text-[0.8125rem]">
                      {data.vote_average.toFixed(1)}
                    </div>
                  </div>
                )}

                {/* 인물 성별 */}
                {props.media === "person" && (
                  <div className="flex justify-between text-gray02">
                    <div className="text-[0.8125rem]">
                      {data.gender === 2
                        ? "남자"
                        : data.gender === 1
                        ? "여자"
                        : "알 수 없음"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 더보기 접기 버튼 */}
        <div
          className="flex flex-col justify-between items-center gap-[0.625rem]
         cursor-pointer"
        >
          {searchedData.slice(0, contPages * 6).length !== totalDataNum && (
            <button
              className="text-gray02 hover:text-gray01"
              onClick={() => {
                setContPages((prev) => prev + 1);
                {
                  searchedData.slice(0, contPages * 6).length % 20 === 0 &&
                    searchedData.slice(0, contPages * 6).length <
                      totalDataNum &&
                    setPages((prev) => prev + 1);
                }
              }}
            >
              더보기
            </button>
          )}
          {contPages !== 1 && (
            <div
              className="text-gray02 cursor-pointer hover:text-gray01"
              onClick={() => {
                setContPages(1);
                setPages(1);
              }}
            >
              접기
            </div>
          )}
        </div>

        {/* 검색결과가 없을 경우 안내 문구 */}
        {totalDataNum === 0 && (
          <div className="text-gray01 text-center text-[0.875rem]">
            검색결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
