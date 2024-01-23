import { NextPage } from "next";

interface Props {
  text: string;
}

const Gradient: NextPage<Props> = ({ text }) => {
  return (
    <span className="bg-gradient-to-r from-[#4b0bff] to-[#68b2ff] bg-clip-text text-transparent dark:from-[#4facfe] dark:to-[#00f2fe]">
      {text}
    </span>
  );
};

export default Gradient;
