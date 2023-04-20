import { CustomizeContext } from "../../providers/CustomizeProvider";
import { useContext } from "react";

export const CustomInputBox = (props: {
  value: string;
  onChange: (e: string) => void;
}) => {
  const { value, onChange } = props;
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;
  return (
    <div className="skt-w mx-1 relative">
      <input
        type="number"
        className={`border-gray-350  skt-w bg-transparent text-widget-secondary text-sm skt-w-input border-[1.5px] pb-0.5 h-full w-full px-3 focus:border-primary-200 text-ellipsis ${
          value ? "border-primary-200" : ""
        }`}
        style={{ borderRadius: "14px" }}
        placeholder="Custom"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step=".001"
        min="0"
      />
      <span className="absolute right-3 top-2 my-auto font-medium pl-2 text-widget-primary">
        %
      </span>
    </div>
  );
};
