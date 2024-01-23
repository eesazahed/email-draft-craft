import { NextPage } from "next";

interface Props {
  parentData: string;
  updateParent: Function;
  label: string;
  name: string;
  placeholder: string;
  number?: boolean;
}

const Input: NextPage<Props> = ({
  label,
  name,
  placeholder,
  parentData,
  updateParent,
  number,
}) => {
  return (
    <label className="block text-gray-700 text-sm mb-2 dark:text-white">
      {label}
      <input
        type={number ? "number" : "text"}
        name={name}
        placeholder={placeholder}
        value={parentData}
        onChange={(e) => updateParent(e.target.value)}
        className="my-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2 dark:border-none dark:caret-white dark:text-white dark:bg-[#1e023a]"
        required
        max={number ? 12 : 99999999999}
        min={number ? 1 : 0}
      />
    </label>
  );
};

export default Input;
