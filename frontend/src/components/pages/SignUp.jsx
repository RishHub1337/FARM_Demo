import React, { useEffect, useRef, useState } from "react";
import { animate, spring, cubicBezier } from "animejs";
import { validate as emailValidator } from "email-validator";
import { useNavigate } from "react-router-dom";
import { to } from "@react-spring/web";

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
          <span className="text-red-700 text-sm font-extralight">enter a valid email</span>
        )}
        {(FieldId === "confirm_password" && !(inputFields.confirmPassword === "") && (!passwordCheckSubmit)) && (
          <span className="text-red-700 text-sm font-extralight">password does not match</span>
        )}
      </div>
    </fieldset>
  );
};

const SignUp = () => {
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
    <div className="flex justify-center items-center h-[calc(100vh-8vh)]">
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
          </div>
          <div>
            <button
              onClick={() => {
                setInputFields(emptyInputField);
                navigate("/email-verification");
              }}
              disabled={!canSubmit || !passwordCheckSubmit || !validEmail}
              className="btn text-xl disabled:bg-gray-600 disabled:text-gray-700 disabled:border-gray-600 focus:outline-1 focus:outline-emerald-400 btn-primary w-[16rem] h-[3rem] px-6 py-3 rounded-none bg-white/10 backdrop-blur-md border border-emerald-400 text-emerald-300 hover:bg-white/20"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
