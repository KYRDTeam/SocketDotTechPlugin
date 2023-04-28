import { CustomizeContext } from "../../providers/CustomizeProvider";
import { useContext } from "react";

interface RadioProps {
  id: string;
  name: string;
  label: string;
  onChange: () => void;
  checked: boolean;
}
export const RadioCheckbox = (props: RadioProps) => {
  const { id, name, label, onChange, checked } = props;
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  return (
    <div className="skt-w relative mx-1">
      <label
        htmlFor={id}
        className={`skt-w flex items-center justify-center w-16 relative z-10 p-2 cursor-pointer border text-sm ${
          checked
            ? "border-primary-200 text-primary-200 border-1"
            : "text-white-900 border-gray-350"
        }`}
        style={{ borderRadius: "14px" }}
      >
        {label}
      </label>
      <input
        type="radio"
        id={id}
        name={name}
        className="skt-w w-0 h-0 opacity-0 z-0 absolute"
        onChange={onChange}
        checked={checked}
      />
    </div>
  );
};
