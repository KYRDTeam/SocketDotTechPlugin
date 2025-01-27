import { ReactElement, useEffect, useState } from "react";
import { X as CloseIcon } from "react-feather";

const BaseModal = ({
  title,
  children,
  onClose,
}: {
  title: string | JSX.Element;
  children: JSX.Element;
  onClose?: any;
}) => {
  useEffect(() => {
    window.onclick = function (event) {
      const modal = document.getElementById("base-modal");
      if (event.target == modal) {
        onClose();
      }
    };
  }, []);

  return (
    <div
      id="base-modal"
      className="fixed z-10 left-0 top-0 w-full h-full overflow-auto justify-center items-center flex bg-blackAlpha-400"
    >
      <div
        className="bg-gray-700 m-auto rounded-xl"
        style={{
          width: "462px",
        }}
      >
        {/* header */}
        <div className="relative px-6 pb-4 pt-8">
          <h1 className="text-xl text-left font-semibold my-0">{title}</h1>
          <CloseIcon
            className="absolute text-lg top-7 right-6 cursor-pointer hover:bg-whiteAlpha-200 p-1 hover:rounded-md"
            onClick={onClose}
          />
        </div>

        {/* content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default BaseModal;
