import { FC, ReactNode, useRef } from "react";

interface Props {
  children: ReactNode;
  tooltip?: string;
  leftParams?: number;
}

const ToolTip: FC<Props> = ({
  children,
  tooltip,
  leftParams = 0,
}): JSX.Element => {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const container = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={container}
      onMouseEnter={({ clientX }) => {
        console.log("test");
        if (!tooltipRef.current || !container.current) return;
        const { left } = container.current.getBoundingClientRect();

        tooltipRef.current.style.left = clientX - left - leftParams + "px";
      }}
      className="group relative inline-block"
    >
      {children}
      {tooltip ? (
        <span
          ref={tooltipRef}
          className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition bg-gray-500 text-white p-1 absolute text-sm top-full mt-2 whitespace-nowrap"
        >
          {tooltip}
        </span>
      ) : null}
    </div>
  );
};

export default ToolTip;
