// import { none } from "animejs/dist/modules/easings/none";
import React, { useState, useRef, useEffect } from "react";

const UserProfile = () => {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const currentPasswordRef = useRef(null);

  const [editFirstName, setEditFirstName] = useState(false);
  const [editLastName, setEditLastName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  const [firstName, setFirstName] = useState("Rajesh");
  const [lastName, setLastName] = useState("Mane");
  const [email, setEmail] = useState("rajeshMane@gmail.com");

  const [onChangePasswordPortion, setOnChangePasswordPortion] = useState(false);

  useEffect(() => {
    firstNameRef.current.focus();
  }, [editFirstName]);

  useEffect(() => {
    lastNameRef.current.focus();
  }, [editLastName]);

  useEffect(() => {
    currentPasswordRef.current.focus();
  }, [onChangePasswordPortion]);

  return (
    <div
      className="grid grid-cols-12  min-w-full min-h-full rounded"
      style={{ userSelect: "none" }}
    >
      <div className="col-span-6 !pr-16 flex justify-end items-center">
        <div className="">
          <img
            className="block mx-auto w-[16rem] h-[16rem] rounded-full !p-4 border-4 border-green-800 object-cover"
            src="/src/assets/userImg.jpeg"
            alt="Rounded avatar"
          />
        </div>
      </div>
      <div className="col-span-6 !pl-16 flex">
        <div
          className={`flex flex-col items-start justify-center gap-4 ${
            !onChangePasswordPortion ? "" : "hidden"
          }`}
        >
          <div className="flex items-center gap-4">
            <input
              disabled={!editFirstName}
              value={firstName}
              ref={firstNameRef}
              onChange={(e) => {
                setFirstName(e.target.value);
                console.log(firstName);
              }}
              className={`w-[24vh] h-[4vh] border-2 ${
                !editFirstName ? "text-gray-400" : "text-black"
              }  border-green-800 flex justify-center items-center !p-4 outline-0`}
              type="text"
            />
            <div id="editIcon">
              <svg
                class="w-8 h-8 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
                onClick={() => {
                  if (!editFirstName) {
                    setEditFirstName(true);
                  } else {
                    setEditFirstName(false);
                  }
                }}
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input
              disabled={!editLastName}
              value={lastName}
              ref={lastNameRef}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              className={`w-[24vh] h-[4vh] border-2 ${
                !editLastName ? "text-gray-400" : "text-black"
              } border-green-800 flex justify-center items-center !p-4 outline-0`}
              type="text"
            />
            <div id="editIcon">
              <svg
                class="w-8 h-8 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
                onClick={() => {
                  if (!editLastName) {
                    setEditLastName(true);
                  } else {
                    setEditLastName(false);
                  }
                }}
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input
              disabled={!editEmail}
              value={email}
              className={`w-[24vh] h-[4vh] border-2 ${
                !editEmail ? "text-gray-400" : "text-black"
              } border-green-800 flex justify-center items-center !p-4`}
              type="text"
            />
          </div>
          <div className="flex flex-col gap-1">
            <button
              className="btn btn-primary w-[24vh] h-[4vh] outline-0 text-2xl font-extralight shadow-none border-0 focus:outline-emerald-400  rounded-none bg-emerald-400"
              onClick={() => setOnChangePasswordPortion(true)}
              type="text"
            >
              Change Password
            </button>
            <button
              onClick={() => alert("Updated")}
              placeholder="Rajesh Mane"
              className="btn btn-primary w-[24vh] h-[4vh] outline-0 text-2xl font-extralight shadow-none border-0 focus:outline-emerald-400  rounded-none bg-emerald-800"
              type="text"
            >
              Update
            </button>
          </div>
        </div>
        {/* Hidden Change Password Form */}
        <div
          className={`flex flex-col items-start justify-center gap-4 ${
            onChangePasswordPortion ? "" : "hidden"
          }`}
        >
          <div className="flex items-center gap-4">
            <input
              placeholder="Current Password"
              ref={currentPasswordRef}
              onChange={(e) => {
                setFirstName(e.target.value);
                console.log(firstName);
              }}
              className={`w-[24vh] h-[4vh] border-2 text-black border-green-800 flex justify-center items-center !p-4 outline-0`}
              type="password"
            />
          </div>
          <div className="flex items-center gap-4">
            <input
              placeholder="New Password"
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              className={`w-[24vh] h-[4vh] border-2 text-black border-green-800 flex justify-center items-center !p-4 outline-0`}
              type="password"
            />
          </div>
          <div className="flex items-center gap-4">
            <input
              placeholder="Confirm New Password"
              className={`w-[24vh] h-[4vh] border-2 text-black border-green-800 flex justify-center items-center !p-4 outline-0`}
              type="password"
            />
          </div>
          <div className="flex flex-col gap-1">
            <button
              className="btn btn-primary w-[24vh] h-[4vh] outline-0 text-2xl font-extralight shadow-none border-0 focus:outline-emerald-400  rounded-none bg-emerald-400"
              type="Submit"
              onClick={() => {
                setOnChangePasswordPortion(false);
              }}
            >
              <svg
                class="w-12 h-12 text-white dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M5 12h14M5 12l4-4m-4 4 4 4"
                />
              </svg>
            </button>
            <button
            onClick={() => {alert("Password Updated")}}
              className="btn btn-primary w-[24vh] h-[4vh] outline-0 text-2xl font-extralight shadow-none border-0 focus:outline-emerald-400  rounded-none bg-emerald-800"
              type="Submit"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
