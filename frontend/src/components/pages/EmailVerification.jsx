import { useRef, useEffect, useState } from "react";
import { animate, spring, cubicBezier } from "animejs";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import ApiManager from "../../apiManager/ApiManager.js";

const InvalidOtp = () => {
  return (
    <p className="flex justify-center mt-2 text-md text-red-700 font-extralight">
      Invalid OTP
    </p>
  );
};

export default function OTPInputs() {
  const [otp, setOtp] = useState("");
  const [invalidOtp, setInvalidOtp] = useState(false);

  const location = useLocation();

  if (!location.state?.allowed) {
    return <Navigate to={"/"} />;
  }
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const navigator = useNavigate();

  useEffect(() => {
    const timer = async () => {
      await sleep(2000);
      setInvalidOtp(false);
    }
    timer();
  }, [invalidOtp]);

  const focusRef = useRef(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    animate(".card", {
      scale: 1.15,
      duration: 150,
      ease: cubicBezier(0.7, 0.1, 0.5, 0.9),
    });
  }, []);

  const handleChange = async (e, index) => {
    const value = e.target.value;

    if (isNaN(Number(value))) {
      e.target.value = "";
      return;
    }

    // Build OTP manually
    const newOtp =
      index === 0 ? value : otp.slice(0, index) + value + otp.slice(index + 1);

    setOtp(newOtp);

    // Auto move
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Backspace move
    if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    // When complete
    if (index === 5 && value !== "") {
      const apiManager = new ApiManager();
      const response = await apiManager.verify_user(
        Number(newOtp),
        location.state.email
      );

      if (response.status === 201) {
        await sleep(100);
        navigator("/dashboard", {state: {allowed: true}});
      } else if (response.status === 406) {
        setInvalidOtp(true);
      }
    }
  };

  return (
    <div>
      <div className="flex min-h-screen w-auto justify-center items-center ">
        <div className="relative card flex justify-center h-[44rem] w-[32rem] items-center rounded-2xl backdrop-blur-md backdrop-opacity-88">
          <div className="absolute flex justify-center items-center top-0 left-0 w-full h-[20rem]">
            <span className="flex justify-center text-emerald-100 text-3xl font-light">
              Email Verification
            </span>
          </div>
          <div className="flex flex-col justify-center h-full">
            <div className="flex items-center justify-center">
              <form className="flex flex-col gap-4">
                <div className="flex mb-2 space-x-2 justify-center gap-4">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      ref={(el) => (inputRefs.current[i] = el)}
                      onChange={(e) => {
                        setOtp(String(e.target.value));
                        handleChange(e, i);
                      }}
                      className="border text-center !p-3  h-12 w-12 text-[1rem] font-extralight rounded-none focus:outline-none focus:ring-0 text-white"
                    />
                  ))}
                </div>
                <div>
                  <p className="flex justify-center mt-2 text-md text-gray-500 dark:text-gray-400 font-extralight">
                    Please enter the 6 digit code we sent via email
                  </p>
                  {invalidOtp === true ? <InvalidOtp /> : ""}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
