import { useEffect, useState } from "react";
import Confetti from "react-confetti";

const ConfettiComponent = () => {
  const [windowDimension, setDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const detectSize = () => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, []);

  return (
    <>
      <Confetti
        width={windowDimension.width}
        height={windowDimension.height}
        numberOfPieces={200}
        recycle={false}
        gravity={0.35}
      />
    </>
  );
};

export default ConfettiComponent;
