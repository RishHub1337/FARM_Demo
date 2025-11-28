import React, { useState, useEffect } from "react";
import Toast from "../styleComponent/Toast";

const DummyTest = () => {
  const [showToast, setShowToast] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    console.log("Toast state:", showToast);
  }, [showToast]);

  const handleClick = async () => {
    setShowToast(true);
    // await sleep(4000);
    // setShowToast(false);
  };

  return (
    <div className="">
      <div className="flex justify-center items-center h-screen">
        <button onClick={handleClick} className="text-black bg-white p-4">
          Click Me to Test!
        </button>
      </div>

      {showToast && <Toast text={"working"} mode={"checkbox"} onClose={() => setShowToast(false)} duration={4000} />}
    </div>
  );
};

export default DummyTest;
