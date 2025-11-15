import React, { useEffect, useRef, useState } from "react";
import { animate, spring, cubicBezier } from "animejs";
import { validate as emailValidator } from "email-validator";
import { useNavigate } from "react-router-dom";
import ApiManager from "../../apiManager/ApiManager.js";

const Loader = () => {
  return (
    <svg
      aria-hidden="true"
      role="status"
      className="w-5 h-5 me-2 text-emerald-300 animate-spin"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="#E5E7EB"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentColor"
      />
    </svg>
  );
};

const InputWrapper = ({
  FieldText,
  FieldId,
  inputFields,
  setInputFields,
  inputRef,
  validEmail,
  passwordCheckSubmit,
  setPasswordCheckSubmit,
}) => {
  const handleConfirmPassword = (e) => {
    const value = e.target.value;

    if (FieldId === "confirm_password") {
      if (value === "") {
        setPasswordCheckSubmit(false);
      } else if (value === inputFields.password) {
        setPasswordCheckSubmit(true);
      } else {
        setPasswordCheckSubmit(false);
      }
    }
  };
  const keyMap = {
    first_name: "firstName",
    last_name: "lastName",
    username: "username",
    email: "email",
    password: "password",
    confirm_password: "confirmPassword",
  };
  return (
    <fieldset className="fieldset">
      <div className="flex flex-col gap-1 text-2xl">
        <label htmlFor={FieldId} className="fieldset-legend font-extralight">
          {FieldText}
        </label>
        <input
          spellCheck="false"
          ref={FieldId === "first_name" ? inputRef : useRef(null)}
          id={FieldId}
          type={
            FieldId === "email"
              ? "email"
              : FieldId === "password" || FieldId === "confirm_password"
              ? "password"
              : "text"
          }
          autoComplete="off"
          value={inputFields[keyMap[FieldId]]}
          // placeholder="Email"
          className="border !p-3  h-10 w-[20rem] text-[1rem] font-extralight rounded-none focus:outline-none focus:ring-0 text-white"
          onChange={(e, el) => {
            handleConfirmPassword(e);
            setInputFields((prev) => ({
              ...prev,
              [keyMap[FieldId]]: e.target.value,
            }));
          }}
        />
        {FieldId === "email" && !validEmail && (
          <span className="text-red-700 text-sm font-extralight">
            enter a valid email
          </span>
        )}
        {FieldId === "confirm_password" &&
          !(inputFields.confirmPassword === "") &&
          !passwordCheckSubmit && (
            <span className="text-red-700 text-sm font-extralight">
              password does not match
            </span>
          )}
      </div>
    </fieldset>
  );
};

const SignUp = () => {

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const handleSignApiCall = async () => {
    setInputFields(emptyInputField);

    setIsLoading(true);

    const apiManager = new ApiManager();
    try {
      const response = await apiManager.createAccount(
        inputFields.username,
        inputFields.password,
        inputFields.firstName,
        inputFields.lastName,
        inputFields.email
      );
      if (response.status === 406) {
        setApiCallError({
          status_code: 406,
          error_message: response.data.detail,
        });
      } else if (response.status === 200) {
        setApiCallError({ status_code: 200, error_message: "" });
      }
      if (response.status === 200) {
        navigate("/email-verification", {
          state: { allowed: true, email: inputFields.email },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  
  const [isLoading, setIsLoading] = useState(false);
  const [apiCallError, setApiCallError] = useState({
    status_code: "",
    error_message: "",
  });
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const emptyInputField = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [inputFields, setInputFields] = useState(emptyInputField);
  const [validEmail, setValidEmail] = useState(true);

  useEffect(() => {
    if (inputFields.email != "") {
      setValidEmail(emailValidator(inputFields.email));
    }
  }, [inputFields.email]);
  useEffect(() => {
    const timer = async () => {
      await sleep(2000);
      setApiCallError({ status_code: 200, error_message: "" });
    };
    timer();
  }, [apiCallError.status_code]);

  const _inputFields = inputFields;
  const canSubmit = [...Object.values(_inputFields)].every(Boolean);
  const [passwordCheckSubmit, setPasswordCheckSubmit] = useState(false);

  const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  const validateEmail = (e) => {
    if (e.target?.value && e.target.value.match(isValidEmail)) {
      setValidEmail(false);
      setInput(e.target.value);
    } else {
      setValidEmail(true);
    }
  };

  React.useEffect(() => {
    animate(".card", {
      scale: 1.15,
      duration: 150,
      ease: cubicBezier(0.7, 0.1, 0.5, 0.9),
    });
  }, []);
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        style={{ padding: "calc(var(--spacing) * 12)" }}
        className="card flex justify-center h-auto w-[36rem] items-center rounded-2xl backdrop-blur-md backdrop-opacity-88"
      >
        <div className="flex flex-col items-center gap-12">
          <div className="flex flex-col gap-8">
            <InputWrapper
              inputRef={inputRef}
              FieldId={"first_name"}
              FieldText={"First Name"}
              inputFields={inputFields}
              setInputFields={setInputFields}
            />
            <InputWrapper
              inputRef={inputRef}
              FieldId={"last_name"}
              FieldText={"Last Name"}
              inputFields={inputFields}
              setInputFields={setInputFields}
            />

            <InputWrapper
              FieldId={"username"}
              FieldText={"Username"}
              inputFields={inputFields}
              setInputFields={setInputFields}
            />

            <InputWrapper
              FieldId={"email"}
              FieldText={"Email"}
              validEmail={validEmail}
              inputFields={inputFields}
              setInputFields={setInputFields}
              setValidEmail={setValidEmail}
            />

            <InputWrapper
              FieldId={"password"}
              FieldText={"Password"}
              inputFields={inputFields}
              setInputFields={setInputFields}
            />

            <InputWrapper
              FieldId={"confirm_password"}
              FieldText={"Confirm Password"}
              inputFields={inputFields}
              setInputFields={setInputFields}
              passwordCheckSubmit={passwordCheckSubmit}
              setPasswordCheckSubmit={setPasswordCheckSubmit}
            />
            <div>
              {apiCallError.status_code === 406 ? (
                <div className="text-red-700 font-extralight">
                  {apiCallError.error_message}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <button
              onClick={() => {
                handleSignApiCall();
              }}
              disabled={!canSubmit || !passwordCheckSubmit || !validEmail}
              className="btn text-xl disabled:bg-gray-600 disabled:text-gray-700 disabled:border-gray-600 focus:outline-1 focus:outline-emerald-400 btn-primary w-[16rem] h-[3rem] px-6 py-3 rounded-none bg-white/10 backdrop-blur-md border border-emerald-400 text-emerald-300 hover:bg-white/20"
            >
              {isLoading ? (
                <Loader />
              ) : 
              ""
              }
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
