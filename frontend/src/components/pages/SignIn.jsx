import React, { useEffect, useRef, useState } from "react";
import { animate, spring, cubicBezier } from "animejs";
import { useNavigate } from "react-router-dom";

const InputWrapper = ({
  FieldText,
  FieldId,
  inputRef,
  inputFields,
  setInputFields,
}) => {
  const keyMap = {
    username: "username",
    password: "password",
  };
  return (
    <fieldset className="fieldset">
      <div className="flex flex-col gap-1 text-2xl">
        <label htmlFor={FieldId} className="fieldset-legend font-extralight">
          {FieldText}
        </label>
        <input
          ref={FieldId === "username" ? inputRef : useRef(null)}
          id={FieldId}
          value={inputFields[keyMap[FieldId]]}
          onChange={(e) => {
            setInputFields((prev) => ({
              ...prev,
              [keyMap[FieldId]]: e.target.value,
            }));
          }}
          type={
            FieldId === "email"
              ? "email"
              : FieldId === "password" || FieldId === "confirm-password"
              ? "password"
              : "text"
          }
          autoComplete="off"
          // placeholder="Email"
          className="border !p-3  h-10 w-[20rem] text-[1rem] font-extralight rounded-none focus:outline-none focus:ring-0 text-white"
        />
      </div>
    </fieldset>
  );
};

const SignIn = () => {
  const navigator = useNavigate();
  const [checkBox, setCheckBox] = useState(false);

  const emptyInputField = {
    username: "",
    password: "",
  };

  const [inputFields, setInputFields] = useState(emptyInputField);
  const _inputFields = inputFields;

  const canSubmit = [...Object.values(_inputFields)].every(Boolean);

  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    animate(".card", {
      scale: 1.15,
      duration: 150,
      ease: cubicBezier(0.7, 0.1, 0.5, 0.9),
    });
  }, []);
  return (
    <div className="flex justify-center items-center h-[calc(100vh-8vh)]">
      <div className="card flex justify-center h-[40rem] w-[32rem] items-center rounded-2xl backdrop-blur-md backdrop-opacity-88">
        <div className="flex flex-col items-center gap-12  p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-8">
              <InputWrapper
                FieldId={"username"}
                FieldText={"Username"}
                inputRef={inputRef}
                inputFields={inputFields}
                setInputFields={setInputFields}
              />
              <InputWrapper
                FieldId={"password"}
                FieldText={"Password"}
                inputFields={inputFields}
                setInputFields={setInputFields}
              />
            </div>
            <div>
              <fieldset className=" rounded-box w-64 p-4 bg-none">
                <label className="label">
                  <input
                    onChange={() => {
                      checkBox == false
                        ? setCheckBox(true)
                        : setCheckBox(false);
                    }}
                    type="checkbox"
                    className="checkbox rounded-none border border-white size-4 bg-none"
                  />
                  <span className="text-white font-extralight">
                    Remember me?
                  </span>
                </label>
              </fieldset>
            </div>
          </div>
          <div>
            <button
              disabled={!canSubmit}
              onClick={() => {
                setInputFields(emptyInputField);
                navigator("/dashboard");
              }}
              className="btn text-xl disabled:bg-gray-600 disabled:text-gray-700 disabled:border-gray-600 focus:outline-1 focus:outline-emerald-400 btn-primary w-[16rem] h-[3rem] px-6 py-3 rounded-none bg-white/10 backdrop-blur-md border border-emerald-400 text-emerald-300 hover:bg-white/20"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
