import { CustomizeContext } from "../../providers/CustomizeProvider";
import { useContext, useEffect } from "react";
import { CheckCircle } from "react-feather";

// FIXME:
export const SuccessToast = () => {
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  useEffect(() => {
    setTimeout(() => {
      const item = document.getElementById("toast-element");
      item.style.visibility = "hidden";
    }, 3000);
  });

  return (
    <div
      id="toast-element"
      className="skt-w bg-widget-accent text-widget-onAccent p-4 flex items-center absolute left-3 right-3"
      style={{ borderRadius: `calc(0.625rem * ${borderRadius})` }}
    >
      <CheckCircle className="skt-w mr-3 text-widget-onAccent" /> Transaction is
      complete
    </div>
  );
};
