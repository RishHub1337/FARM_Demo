// import { none } from "animejs/dist/modules/easings/none";
import React, { useState } from "react";

const UserProfile = () => {
  const [editFirstName, setEditFirstName] = useState(false);
  const [editLastName, setEditLastName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  const [firstName, setFirstName] = useState("Rajesh");
  const [lastName, setLastName] = useState("Mane");
  const [email, setEmail] = useState("rajeshMane@gmail.com");

  return (
    <div
      className="grid grid-cols-12  min-w-full min-h-full rounded"
      style={{ userSelect: "none" }}
    >
      <div className="col-span-6 !pr-16 flex justify-end items-center ">
        <div className="">
          <img
            className="block mx-auto w-[16rem] h-[16rem] rounded-full !p-4 border-4 border-green-800 object-cover"
            src="/src/assets/userImg.jpeg"
            alt="Rounded avatar"
          />
        </div>
      </div>
      <div className="col-span-6 flex flex-col gap-4 !pl-16 items-start justify-center ">
        <div className="flex items-center gap-4">
          <input
            disabled={!editFirstName}
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              console.log(firstName);
            }}
            className={`w-[24vh] h-[4vh] border-2 ${
              !editFirstName ? "text-gray-400" : "text-black"
            }  border-green-800 flex justify-center items-center !p-4`}
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
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            className={`w-[24vh] h-[4vh] border-2 ${
              !editLastName ? "text-gray-400" : "text-black"
            } border-green-800 flex justify-center items-center !p-4`}
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
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className={`w-[24vh] h-[4vh] border-2 ${
              !editEmail ? "text-gray-400" : "text-black"
            } border-green-800 flex justify-center items-center !p-4`}
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
                if (!editEmail) {
                  setEditEmail(true);
                } else {
                  setEditEmail(false);
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
        <div className="flex flex-col gap-1">
          <button
            className="w-[24vh] h-[4vh] border-2 bg-green-400 text-white flex items-center justify-center !p-4"
            type="text"
          >
            Change Password
          </button>
          <button
            disabled
            placeholder="Rajesh Mane"
            className="w-[24vh] h-[4vh] border-2 bg-green-800 flex justify-center items-center !p-4 text-white"
            type="text"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
