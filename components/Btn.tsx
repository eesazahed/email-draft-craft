import { NextPage } from "next";

interface Props {
  text: string;
  onClick?: Function;
  submit?: boolean;
  color?: string;
}

const Btn: NextPage<Props> = ({ text, onClick, color, submit }) => {
  return (
    <button
      style={{ background: color || "#1E90FF" }}
      className="mt-8 hover:brightness-90 w-full text-white text-base py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
      onClick={() => (onClick ? onClick() : {})}
      type={submit ? "submit" : "button"}
    >
      {text}
    </button>
  );
};

export default Btn;
