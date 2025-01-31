import { useEffect, useRef, useState } from "react";

export default function ContentOverview({ overview }: { overview?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current;
      setIsOverflow(scrollHeight > clientHeight); // 실제 높이가 제한된 높이보다 크면 true
    }
  }, [overview]);

  return (
    <div className="flex flex-col gap-[5px] text-[0.875rem] text-gray01 font-light leading-5">
      {/* 내용 */}
      <div
        ref={contentRef}
        className={`relative overflow-hidden text-justify leading-5 ${
          isExpanded
            ? "text-gray01 bg-gradient-to-b from-black/50 to-black/100"
            : "line-clamp-3"
        }`}
      >
        {overview}
      </div>

      {/* 더보기 / 접기 버튼 (줄이 넘칠 때만 표시) */}
      {isOverflow && (
        <button
          className="text-main/50 font-medium ml-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? " 접기" : "더보기"}
        </button>
      )}
    </div>
  );
}
