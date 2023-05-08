import { useState } from "react";
import { CheckCircle, Check, Copy } from "react-feather";
import ToolTip from "./Tooltip";

const CopyToClipboard = ({ value }) => {
  const [isCopied, setIsCopied] = useState(false);

  // This is the function we wrote earlier
  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = (event) => {
    event.stopPropagation();

    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(value)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <ToolTip tooltip={isCopied ? "Copied" : "Copy"} leftParams={30}>
        {isCopied && (
          <div className="relative">
            <div className="rounded-full w-4 h-4 bg-primary-200 mr-2 flex justify-center items-center">
              <Check className="w-3 h-3 text-black" strokeWidth={3} />
            </div>

            {/* <div
              style={{
                left: "-30px",
                boxShadow: "0px 6px 42px rgba(0, 0, 0, 0.8)",
              }}
              className="absolute top-5 left-4 py-1 px-3 bg-gray-500 text-sm"
            >
              Copied
            </div> */}
          </div>
        )}
        {!isCopied && (
          <Copy
            onClick={handleCopyClick}
            className="w-4 h-4 mr-2 text-gray-400 hover:text-primary-200"
          />
        )}
      </ToolTip>
    </>
  );
};

export default CopyToClipboard;
