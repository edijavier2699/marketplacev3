import { ReactNode } from "react";

const FlippingCard = ({
  isFlipped,
  front,
  back,
}: {
  isFlipped: boolean;
  front: ReactNode;
  back: ReactNode;
}) => (
  <div className="h-full [perspective:1000px]">
    <div
      className={`relative h-full w-full transition-transform duration-300 ease-in-out ${
        isFlipped ? "[transform:rotateX(-180deg)]" : ""
      } [transform-style:preserve-3d]`}
    >
      <div className="[backface-visibility:hidden] absolute h-full w-full">
        {front}
      </div>
      <div className="[transform:rotateX(180deg)] [backface-visibility:hidden] absolute h-full w-full bg-white rounded-lg">
        {back}
      </div>
    </div>
  </div>
);

export default FlippingCard