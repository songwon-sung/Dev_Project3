import React from "react";
import noImage from "../assets/noImage/noImage.svg";

export default function SearchPage() {
  return (
    <div className="w-full min-h-100vh h-screen mt-[3.625rem] mb-[5.75rem]">
      SearchPage
      <div
        className="w-full h-full bg-cover"
        style={{ backgroundImage: `url(${noImage})` }}
      ></div>
    </div>
  );
}
