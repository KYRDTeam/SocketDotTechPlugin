import { ReactElement, ReactNode, useContext } from "react";
import { X } from "react-feather";
import { CustomizeContext } from "../../providers/CustomizeProvider";
import { Header } from "./Header";
interface ModalProps {
  title: ReactElement | string;
  closeModal?: () => void;
  children: ReactNode;
  disableClose?: boolean;
  classNames?: string;
  style?: any;
  noBorder?: boolean;
  noPadding?: boolean;
}
export const Modal = ({
  title,
  closeModal,
  children,
  disableClose = false,
  classNames,
  style,
  noBorder = false,
  noPadding = false,
}: ModalProps) => {
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;
  return (
    <div
      style={style}
      className="skt-w w-full h-full absolute top-0 left-0 z-50 bg-black bg-opacity-10"
    >
      <div
        className={`skt-w w-full h-full bg-gray-700 flex flex-col overflow-hidden ${
          !noPadding ? "p-5" : ""
        } ${classNames ?? ""}`}
        style={{ borderRadius: `calc(0.75rem * ${borderRadius})` }}
      >
        <div
          className={`skt-w p-3 pt-2.5 ${
            !noBorder ? "border-b border-widget-secondary" : ""
          } ${noPadding ? "mx-5 mt-5" : ""}`}
        >
          <Header title={title}>
            {closeModal && (
              <button
                onClick={closeModal}
                disabled={disableClose}
                className="skt-w skt-w-input skt-w-button disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <X className="skt-w w-5.5 h-5.5 text-widget-secondary" />
              </button>
            )}
          </Header>
        </div>
        {children}
      </div>
    </div>
  );
};
