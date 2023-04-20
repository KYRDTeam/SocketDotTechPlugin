import { ReactNode, useContext } from "react";
import { Spinner } from "./Spinner";
import { CustomizeContext } from "../../providers/CustomizeProvider";
interface ButtonProps {
  onClick: () => void;
  children: ReactNode | string;
  primary?: boolean;
  secondary?: boolean;
  disabled?: boolean;
  classNames?: string;
  isLoading?: boolean;
}
export const Button = (props: ButtonProps) => {
  const {
    onClick,
    children,
    disabled = false,
    secondary = false,
    primary = true,
    classNames,
    isLoading = false,
  } = props;

  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`skt-w skt-w-input skt-w-button h-11 px-3 flex items-center justify-center transition-all duration-100 ease-linear w-full bg-primary-200 text-sm rounded-2xl text-gray-800 hover:bg-opacity-90 
      disabled:bg-primary-450
      disabled:text-white-900 
      disabled:opacity-50 
      disabled:font-normal 
      disabled:border-opacity-50
      ${classNames || ""}`}
      // style={{ borderRadius: `calc(0.625rem * ${borderRadius})` }}
    >
      {isLoading && <Spinner size={4} />}{" "}
      <span className="ml-2">{children}</span>
    </button>
  );
};
