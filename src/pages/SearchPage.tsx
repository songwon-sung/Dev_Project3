import noImage2 from "../assets/noImage/noImage2.svg";

export default function SearchPage() {
  return (
    <div className="w-full min-h-100vh h-screen mt-[3.625rem] mb-[5.75rem]">
      SearchPage
      <div
        className="w-[110px] h-[138px] bg-cover bg-center"
        style={{ backgroundImage: `url(${noImage2})` }}
      ></div>
      <img src={noImage2} />
    </div>
  );
}
