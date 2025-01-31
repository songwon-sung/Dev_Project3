import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div
      className="fixed w-[30rem] h-[3.625rem] flex justify-center items-center
              bg-black01/80 text-main font-bold"
    >
      <Link to="/" className="w-[3.875rem] text-center">
        WONNY MOVIE
      </Link>
    </div>
  );
}
