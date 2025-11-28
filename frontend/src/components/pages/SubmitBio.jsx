import React, { useEffect, useState } from "react";
import { forwardRef } from "react";
import { useRef } from "react";
import ApiManager from "../../apiManager/ApiManager.js";
import { useNavigate } from "react-router-dom";
// import { build } from "vite";

const InputWrapper = forwardRef(({ value, setValue, ref }) => {
  return (
    <div className="flex flex-col gap-1 text-2xl">
      <input
        ref={ref}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        autoComplete="off"
        // placeholder="Email"
        className="border !p-3  h-10 w-[20rem] text-[1rem] font-extralight rounded-none focus:outline-none focus:ring-0 text-white"
      />
    </div>
  );
});

const SubmitBio = () => {
  const bioRef = useRef(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [bio, setBio] = useState("");
  const [bioUpdateStatus, setBioUpdateStatus] = useState("");

  const navigator = useNavigate();

  const submit_profile_bio = async () => {
    const apiManager = new ApiManager();

    const response = await apiManager.update_bio(bio);
    if (response.status === 200) {
      setBioUpdateStatus("Bio updated successfully");
      navigator("/dashboard", { state: { allowed: true } });
    } else {
      setBioUpdateStatus("Something went wrong!");
    }
  };

  useEffect(() => {
    if (bio !== "") {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [bio]);

  useEffect(() => {
    bioRef.current?.focus();
  }, []);
  return (
    <div className="flex min-h-screen w-auto justify-center items-center ">
      <div className="relative card flex justify-center h-[44rem] w-[32rem] items-center rounded-2xl backdrop-blur-md backdrop-opacity-88">
        <div className="absolute flex justify-center items-center top-0 left-0 w-full h-[15rem]">
          <span className="flex justify-center text-emerald-100 text-3xl font-light">
            Please set up a bio!
          </span>
        </div>
        <div className="flex flex-col justify-center items-center gap-8">
          <div>
            <InputWrapper value={bio} setValue={setBio} ref={bioRef} />
          </div>
          <div>
            <button
              disabled={!canSubmit}
              onClick={submit_profile_bio}
              className="btn text-xl disabled:bg-gray-600 disabled:text-gray-700 disabled:border-gray-600 focus:outline-1 focus:outline-emerald-400 btn-primary w-[16rem] h-[3rem] px-6 py-3 rounded-none bg-white/10 backdrop-blur-md border border-emerald-400 text-emerald-300 hover:bg-white/20"
            >
              Enter the FARM!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitBio;
