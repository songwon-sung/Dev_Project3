import { Outlet, useLocation, useNavigate } from "react-router-dom";
import mainBg from "../assets/bgImg/mainBg.svg";
import Header from "../components/root/Header";
import Navigator from "../components/root/Navigator";
import topbuttom from "../assets/button/topButton.svg";
import topbuttomHover from "../assets/button/topButtonHover.svg";
import prevbuttom from "../assets/button/prevButton.svg";
import prevbuttomHover from "../assets/button/prevButtonHover.svg";

export default function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  /* 탑버튼 이동 함수 */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* 이전 페이지 이동 함수 */
  const moveToPrevPage = () => {
    navigate(-1);
  };

  return (
    <div className="w-full h-full">
      {/* 뒷 배경 */}
      <div
        className="fixed w-full h-screen blur-sm bg-cover bg-center"
        style={{ backgroundImage: `url(${mainBg})` }}
      ></div>
      {/* 검정 오버레이 */}
      <div className="fixed w-full h-screen bg-black/70"></div>
      <div
        className="w-full h-max absolute
                  flex flex-col justify-between items-center"
      >
        {/* 레이아웃 */}
        <div className="w-[30rem] min-h-screen bg-black01 flex flex-col justify-between">
          <Header />
          <Outlet />
          <Navigator />
        </div>

        {/* top & prev 버튼 */}
        <div
          className="fixed transform -translate-x-1/2 -translate-y-1/2 
          flex flex-col gap-[0.5rem]"
          style={
            location.pathname === "/"
              ? { left: "calc(50% + 13.75rem", bottom: "40%" }
              : { left: "calc(50% + 13.3rem", bottom: "40%" }
          }
        >
          {/* top버튼 */}
          <div
            className="flex flex-col justify-center group cursor-pointer"
            onClick={scrollToTop}
          >
            <img
              src={topbuttom}
              alt="topbutton"
              className="w-[1.7rem] group-hover:opacity-0"
            />
            <img
              src={topbuttomHover}
              alt="topbuttonhover"
              className="w-[1.7rem] opacity-0 absolute group-hover:opacity-100"
            />
          </div>
          {/* prev버튼 */}
          <div
            className="flex flex-col justify-center group cursor-pointer"
            onClick={moveToPrevPage}
          >
            <img
              src={prevbuttom}
              alt="prevbutton"
              className="w-[1.7rem] group-hover:opacity-0"
            />
            <img
              src={prevbuttomHover}
              alt="prevbuttonhover"
              className="w-[1.7rem] opacity-0 absolute group-hover:opacity-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
