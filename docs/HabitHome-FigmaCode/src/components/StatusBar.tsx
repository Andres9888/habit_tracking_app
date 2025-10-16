import svgPaths from '../imports/svg-vi3ciutu8c';

export function StatusBar() {
  return (
    <div className="relative w-full h-11 flex-shrink-0">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="text-[15px] font-semibold">9:41</div>
        <div className="flex items-center gap-[5px]">
          {/* Wifi Icon */}
          <svg
            className="w-[15px] h-3"
            viewBox="0 0 15 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={svgPaths.p111ee900}
              fill="black"
            />
          </svg>
          {/* Signal Bars */}
          <svg
            className="w-[13px] h-3"
            viewBox="0 0 14 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={svgPaths.p3bc3f700}
              fill="black"
            />
          </svg>
          {/* Battery */}
          <svg
            className="w-[25px] h-3"
            viewBox="0 0 13 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={svgPaths.pf622b00}
              fill="black"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
