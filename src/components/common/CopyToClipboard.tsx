import { useState } from "react";
import { CheckCircle, Check, Copy } from "react-feather";

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
      {isCopied && (
        <div className="rounded-full w-4 h-4 bg-primary-200 mr-2">
          <Check className="w-3 h-3 text-black" strokeWidth={2} />
        </div>
      )}
      {!isCopied && (
        <Copy
          onClick={handleCopyClick}
          className="w-4 h-4 mr-2 text-gray-400 hover:text-primary-200"
        />
      )}
    </>
  );
};

export default CopyToClipboard;
