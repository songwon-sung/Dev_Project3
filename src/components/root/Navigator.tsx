import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import NavItem from "../navigation/NavItem";

interface genresType {
  id: number;
  name: string;
}

export default function Navigator() {
  const location = useLocation();

  return (
    <div>
      {/* 네비게이션 바 */}
      <div className="fixed bottom-0 w-[30rem] h-[3.75rem] bg-black flex justify-between px-[2.5rem]">
        <NavItem to="/" icon="navHome" active={location.pathname === "/"} />
        <NavItem
          to="/tv"
          icon="navTv"
          active={location.pathname.includes("tv")}
        />
        <NavItem
          to="/movie"
          icon="navMovie"
          active={location.pathname.includes("movie")}
        />
        <NavItem
          to="/search"
          icon="navSearch"
          active={location.pathname.includes("search")}
        />
      </div>
    </div>
  );
}
