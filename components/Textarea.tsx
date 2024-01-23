import { NextPage } from "next";

interface Props {
  parentData: string;
  updateParent: Function;
  name: string;
  label?: string;
  placeholder?: string;
  autoFocus?: boolean;
  large?: boolean;
}

const Textarea: NextPage<Props> = ({
  name,
  label,
  placeholder,
  parentData,
  updateParent,
  autoFocus,
  large,
}) => {
  return (
    <label className="block text-gray-700 text-sm mb-2 dark:text-white">
      {label}
      <textarea
        name={name}
        placeholder={placeholder}
        value={parentData}
        onChange={(e) => updateParent(e.target.value)}
        autoFocus={autoFocus}
        className={`my-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2 ${
          large ? "h-96" : "h-32"
        } dark:border-none dark:caret-white dark:text-white dark:bg-[#1e023a]`}
        required
      />
    </label>
  );
};

export default Textarea;
