import { useState } from "react";

export default function ContentOverview({ overview }: { overview?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="flex flex-col gap-[5px]
    text-[0.875rem] text-gray01 font-light leading-5"
    >
      <div
        className={`relative ${
          isExpanded
            ? "text-gray01 bg-gradient-to-b from-black/50 to-black/100"
            : "line-clamp-3"
        } 
          overflow-hidden text-justify leading-5`}
      >
        {overview}
      </div>

      {/* 더보기 / 접기 버튼 */}
      {overview && overview.length > 0 && (
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
