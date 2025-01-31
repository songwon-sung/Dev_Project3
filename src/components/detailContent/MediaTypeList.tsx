import { useEffect, useRef, useState } from "react";
import { IMAGE_BASE_URL } from "../../api/axios";
import scrollButtonLeft from "../../assets/button/scrollButtonLeft.svg";
import scrollButtonRight from "../../assets/button/scrollButtonRight.svg";
import noImage from "../../assets/noImage/noImage.svg";

interface MediaTypeListProps {
  images: ImagesType;
  videos: VideosType[];
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

export default function MediaTypeList(props: MediaTypeListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isFirst, setIsFirst] = useState(true); // 첫 번째 이미지인지 체크
  const [isLast, setIsLast] = useState(false); // 마지막 이미지인지 체크
  const [selectedMedia, setSelectedMedia] = useState<string>("backdrops");

  // console.log(selectedMedia);
  /* 왼쪽 스크롤 버튼 함수 */
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      if (selectedMedia === "poster") {
        scrollContainerRef.current.scrollBy({ left: -150, behavior: "smooth" });
      } else {
        scrollContainerRef.current.scrollBy({ left: -380, behavior: "smooth" });
      }
    }
  };

  /* 오른쪽 스크롤 버튼 함수 */
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      if (selectedMedia === "poster") {
        scrollContainerRef.current.scrollBy({ left: 150, behavior: "smooth" });
      } else {
        scrollContainerRef.current.scrollBy({ left: 380, behavior: "smooth" });
      }
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
    <div className="flex flex-col gap-[20px]">
      <div className="flex justify-start gap-[20px] text-[1.125rem] font-medium">
        {/* 미디어 목록 */}
        <div className="text-white">미디어</div>
        <div
          onClick={() => setSelectedMedia("backdrops")}
          className={`${
            selectedMedia === "backdrops"
              ? "text-main"
              : "text-gray02 hover:text-gray01"
          } cursor-pointer flex items-center gap-[5px]`}
        >
          <div>이미지</div>
          <div className="text-gray02 text-[0.75rem] font-medium">
            {props.images.backdrops.length}개
          </div>
        </div>
        <div
          onClick={() => setSelectedMedia("posters")}
          className={`${
            selectedMedia === "posters"
              ? "text-main"
              : "text-gray02 hover:text-gray01"
          } cursor-pointer flex items-center gap-[5px]`}
        >
          <div>포스터</div>
          <div className="text-gray02 text-[0.75rem] font-medium">
            {props.images.posters.length}개
          </div>
        </div>
        <div
          onClick={() => setSelectedMedia("videos")}
          className={`${
            selectedMedia === "videos"
              ? "text-main"
              : "text-gray02 hover:text-gray01"
          } cursor-pointer flex items-center gap-[5px]`}
        >
          <div>영상</div>
          <div className="text-gray02 text-[0.75rem] font-medium">
            {props.videos.length}개
          </div>
        </div>
      </div>
      <div
        className={`relative flex flex-row flex-nowrap overflow-hidden mb-[55px]`}
      >
        {/* 왼쪽 토글 버튼 */}
        <div
          className={`absolute w-[6.25rem] h-full pl-[0.625rem]
      flex flex-col justify-center items-start ${isFirst ? "hidden" : ""}`}
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
          className={`absolute right-0 w-[6.25rem] h-full pr-[0.625rem]
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

        {/* 컨텐츠 목록 */}
        <div
          ref={scrollContainerRef}
          style={{ scrollBehavior: "smooth" }}
          className="w-full flex flex-row justify-start gap-[10px] overflow-hidden"
        >
          {selectedMedia === "backdrops"
            ? props.images.backdrops.map((backdrop) => (
                <div
                  key={backdrop.file_path}
                  className="h-fit flex flex-col gap-[10px]"
                >
                  <div className="w-[23.125rem] h-[12.5rem]">
                    <img
                      src={
                        backdrop.file_path
                          ? `${IMAGE_BASE_URL}original${backdrop.file_path}`
                          : noImage
                      }
                      alt="backdrops image"
                      className="w-full h-full object-cover rounded-[0.3125rem]"
                    />
                  </div>
                </div>
              ))
            : selectedMedia === "posters"
            ? props.images.posters.map((poster) => (
                <div
                  key={poster.file_path}
                  className="w-[9.375rem] h-[12.5rem] flex-shrink-0 bg-cover bg-center 
          rounded-lg"
                  style={{
                    backgroundImage: `url(${IMAGE_BASE_URL}original${poster.file_path})`,
                  }}
                ></div>
              ))
            : props.videos.map((video) => (
                <div
                  key={video.key}
                  className="flex flex-col gap-[10px] flex-shrink-0 w-[23.125rem]"
                >
                  <div className="text-[1rem] text-white">{video.name}</div>
                  <iframe
                    className="w-[23.125rem] h-[13.125rem] rounded-lg"
                    src={`https://www.youtube.com/embed/${video.key}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
