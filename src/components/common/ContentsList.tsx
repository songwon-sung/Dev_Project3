import { Link } from "react-router-dom";
import Content from "./Content";

interface ContentsListProps {
  title?: string;
  media?: string;
  listname: string;
}

export default function ContentsList(props: ContentsListProps) {
  return (
    <div className="w-full h-full flex flex-col gap-[1.25rem]">
      {/* 컨텐츠리스트 정보 */}
      <div className="flex justify-between items-baseline">
        <div className="text-white text-[1.25rem]">{props.title}</div>
        <Link
          to={`/${props.media}_${props.listname}`}
          className="text-gray01 text-[1rem]"
        >
          더보기
        </Link>
      </div>

      {/* 세부컨텐츠 */}
      <div className="w-full h-full">
        <Content media={props.media} listname={props.listname} />
      </div>
    </div>
  );
}
