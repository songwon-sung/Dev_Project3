import { Link } from "react-router-dom";

// Vite에서 이미지를 동적으로 불러오는 방식
const icons: Record<string, string> = import.meta.glob(
  "../../assets/navigator/*.svg",
  { eager: true, as: "url" }
);

export default function NavItem({
  to,
  icon,
  active,
}: {
  to: string;
  icon: string;
  active: boolean;
}) {
  return (
    <Link to={to} className="flex flex-col justify-center group relative">
      <img
        src={
          icons[`../../assets/navigator/${icon}${active ? "Click" : ""}.svg`]
        }
        alt={icon}
        className="w-[2.25rem]"
      />
      {!active && (
        <>
          <img
            src={icons[`../../assets/navigator/${icon}.svg`]}
            alt={icon}
            className="w-[2.25rem] absolute group-hover:opacity-0"
          />
          <img
            src={icons[`../../assets/navigator/${icon}Hover.svg`]}
            alt={`${icon}hover`}
            className="w-[2.25rem] absolute opacity-0 group-hover:opacity-100"
          />
        </>
      )}
    </Link>
  );
}
