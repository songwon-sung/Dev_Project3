import { useEffect, useState } from "react";
import { API_KEY, API_URL, IMAGE_BASE_URL } from "../api/axios";
import axios from "axios";
import fulledStar from "../assets/star/fulledStar.svg";
import halfStar from "../assets/star/halfStar.svg";
import emptyStar from "../assets/star/emptyStar.svg";
import { Link } from "react-router-dom";

interface MainImageProps {
  title?: string;
  media?: string;
  listName?: string;
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
}

export default function MainImage(props: MainImageProps) {
  const [contents, setContents] = useState<ContentsType[]>([]); //영화 배열 상태
  const [currentIndex, setCurrentIndex] = useState<number>(0); // 현재 선택된 영화의 인덱스
  const [mediaType, setMediaType] = useState<string>();

  /* 영화 데이터 불러오기 */
  useEffect(() => {
    const media =
      props.media === "all" // media가 all이면 랜덤 적용
        ? Math.random() < 0.5
          ? "tv"
          : "movie"
        : props.media; // media가 all이 아니면 해당 media 적용
    const fetchContents = async () => {
      const contentsList = `trending/${media}/day?api_key=${API_KEY}&language=ko-kr&page=1`;
      setMediaType(media);

      try {
        const response = await axios.get(`${API_URL}${contentsList}`);
        if (response.data && response.data.results) {
          // 컨텐츠 10개만 저장
          const sliceContents = response.data.results.slice(0, 10);
          setContents(sliceContents);
        } else {
          console.error("Contents data not found");
        }
      } catch (error) {
        console.error("Error fetching contents:", error);
      }
    };
    fetchContents();
  }, [props.media]);

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

  /* setInterval로 10초마다 이미지 변경 */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === contents.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 해제
  }, [contents.length]); // movies 배열이 바뀔 때마다 실행

  return (
    <div
      className="w-full h-[30.125rem] flex flex-col justify-center items-center 
    relative overflow-hidden"
    >
      <div
        className="w-full h-full flex transition-transform duration-700"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {contents.map((content) => (
          <Link
            to={`/detail/${mediaType}/${content.id}`}
            key={content.id}
            className="w-[30rem] h-[30.125rem] bg-gray01 bg-cover bg-center
              flex flex-col justify-end items-center"
            style={{
              backgroundImage: `url(${IMAGE_BASE_URL}original${content.poster_path})`,
            }}
          >
            {/* 검정 오버레이 */}
            <div
              className="w-[30rem] h-[30.125rem] flex flex-col justify-end 
            px-[40px] py-[80px] z-10 bg-gradient-to-b from-black/0 to-black/100"
            >
              {/* 컨텐츠 제목 및 별점 */}
              <div className="w-full flex flex-col justify-between gap-[0.625rem]">
                {/* 컨텐츠 제목 */}
                <div className="text-[1.5rem] text-white font-bold">
                  {content.title || content.name}
                </div>
                <div className="flex items-center gap-[0.3125rem]">
                  {/* 별점 */}
                  <div className="flex gap-0">
                    {renderStars(content.vote_average)}
                  </div>
                  {/* 평점 */}
                  <div className="text-white">
                    {content.vote_average.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 원형 토글 */}
      <div className="absolute w-full bottom-[30px] z-10 flex justify-center gap-[10px]">
        {contents.map((content, index) => (
          <button
            key={content.id}
            onClick={() => setCurrentIndex(index)}
            className={`w-[12px] h-[12px] rounded-full transition-all ${
              currentIndex === index ? "bg-main" : "bg-gray01/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
