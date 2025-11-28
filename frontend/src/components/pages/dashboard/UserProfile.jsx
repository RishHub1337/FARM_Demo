// import { none } from "animejs/dist/modules/easings/none";
import React, { useState, useRef, useEffect, useDebugValue } from "react";
import ApiManager from "../../../apiManager/ApiManager.js";
import Loader from "../../styleComponent/Loader.jsx";

const PassworMatchCaution = ({ text }) => {
  return (
    <div className="text-red-700 font-extralight flex items-center justify-center text-[20px]">
      {text}
    </div>
  );
};

const UserProfile = () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const currentPasswordRef = useRef(null);

  const [editFirstName, setEditFirstName] = useState(false);
  const [editLastName, setEditLastName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [newPasswordMatch, setNewPasswordMatch] = useState(true);
  const [userProfileLoading, setUserProfileLoading] = useState(true);
  const [showUpdateNameToast, setShowUpdateNameToast] = useState(false);
  const [showUpdatePasswordToast, setShowUpdatePasswordToast] = useState({
    showToast: false,
    toastText: "",
  });

  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
  });
  const [userPassword, setUserPassword] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [onChangePasswordPortion, setOnChangePasswordPortion] = useState(false);

  useEffect(() => {
    if (editFirstName && firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, [editFirstName]);

  useEffect(() => {
    if (editLastName && lastNameRef.current) {
      lastNameRef.current.focus();
    }
  }, [editLastName]);

  useEffect(() => {
    currentPasswordRef.current.focus();
  }, [onChangePasswordPortion]);

  useEffect(() => {
    const newPass = userPassword.new_password.trim();
    const confirmPass = userPassword.confirm_new_password.trim();

    // If both empty → no error
    if (newPass === "" && confirmPass === "") {
      setNewPasswordMatch(true);
      setUpdatePassword(false);
      return;
    }

    // If one is empty → no error yet
    if (newPass === "" || confirmPass === "") {
      setNewPasswordMatch(true);
      setUpdatePassword(false);
      return;
    }

    // Both filled: check match
    const match = newPass === confirmPass;

    setNewPasswordMatch(match);
    setUpdatePassword(match);
  }, [userPassword.new_password, userPassword.confirm_new_password]);

  useEffect(() => {
    const get_user = async () => {
      try {
        const apiManager = new ApiManager();
        const response = await apiManager.get_user();
        setUserInfo(response.data);
      } finally {
        setUserProfileLoading(false);
      }
    };
    get_user();
  }, []);

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  const handleUpdateName = () => {
    const update_name = async () => {
      try {
        const apiManager = new ApiManager();
        const response = await apiManager.update_name(
          userInfo.first_name,
          userInfo.last_name
        );
        if (response.status === 200) {
          setShowUpdateNameToast(true);
          await sleep(3000);
          setShowUpdateNameToast(false);
        }
      } catch (err) {
        console.error("Failed to update name:", err);
      } finally {
        setEditFirstName(false);
        setEditLastName(false);
      }
    };

    update_name();
  };

  const handleUpdatePassword = () => {
    const apiManager = new ApiManager();
    const update_password = async () => {
      try {
        const res = await apiManager.update_password(
          userPassword.current_password,
          userPassword.new_password
        );
        if (res.status === 200) {
          setShowUpdatePasswordToast({
            showToast: true,
            toastText: "Password Updated Successfully",
          });
          await sleep(3000);
          setShowUpdatePasswordToast({
            showToast: false,
            toastText: "Password Updated Successfully",
          });
        } else if (res.status === 406) {
          setShowUpdatePasswordToast({
            showToast: true,
            toastText: "Current Password Is Incorrect",
          });
          await sleep(3000);
          setShowUpdatePasswordToast({
            showToast: false,
            toastText: "Current Password Is Incorrect",
          });
        }
      } catch (err) {
        console.error("Failede to update name:", err);
      }
    };
    update_password();
  };

  return (
    <div className="">
      <div className="flex flex-col">
        <div className="flex justify-center items-center h-15 text-red-800">
          {showUpdatePasswordToast.showToast
            ? showUpdatePasswordToast.toastText
            : ""}
          {showUpdateNameToast ? "Updated Successfully" : ""}
        </div>
        <div className={`${userProfileLoading ? "" : "hidden"}`}>
          <Loader />
        </div>
        <div
          className={` grid grid-cols-12  min-w-full min-h-full rounded ${
            userProfileLoading ? "hidden" : ""
          }`}
          style={{ userSelect: "none" }}
        >
          <div className={`col-span-6 !pr-16 flex justify-end items-center`}>
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
              className={`flex flex-col items-start justify-center gap-8 ${
                !onChangePasswordPortion ? "" : "hidden"
              }`}
            >
              <div className="flex flex-col items-start justify-center gap-4">
                <div>
                  <span>First Name:</span>
                  <div className="flex items-center gap-4">
                    <input
                      disabled={!editFirstName}
                      value={userInfo.first_name}
                      title={userInfo.first_name}
                      ref={firstNameRef}
                      onChange={(e) => {
                        setUserInfo({
                          ...userInfo,
                          first_name: e.target.value,
                        });
                        console.log(userInfo.first_name);
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
                </div>
                <div>
                  <span>Last Name:</span>
                  <div className="flex items-center gap-4">
                    <input
                      disabled={!editLastName}
                      value={userInfo.last_name}
                      title={userInfo.last_name}
                      ref={lastNameRef}
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, last_name: e.target.value });
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
                </div>
                <div>
                  <span>Username:</span>
                  <div className="flex items-center gap-4">
                    <input
                      disabled={true}
                      value={userInfo.username}
                      title={userInfo.username}
                      className={`w-[24vh] h-[4vh] border-2 ${
                        true ? "text-gray-400" : "text-black"
                      } border-green-800 flex justify-center items-center !p-4`}
                      type="text"
                    />
                  </div>
                </div>
                <div>
                  <span>Email:</span>
                  <div className="flex items-center gap-4">
                    <input
                      disabled={true}
                      value={userInfo.email}
                      title={userInfo.email}
                      className={`w-[24vh] h-[4vh] border-2 ${
                        true ? "text-gray-400" : "text-black"
                      } border-green-800 flex justify-center items-center !p-4`}
                      type="text"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-1">
                  <button
                    className="btn btn-primary w-[24vh] h-[4vh] outline-0 text-2xl font-extralight shadow-none border-0 focus:outline-emerald-400  rounded-none bg-emerald-400"
                    onClick={() => setOnChangePasswordPortion(true)}
                    type="text"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={handleUpdateName}
                    className="btn btn-primary w-[24vh] h-[4vh] outline-0 text-2xl font-extralight shadow-none border-0 focus:outline-emerald-400  rounded-none bg-emerald-800"
                    type="button"
                  >
                    Update
                  </button>
                </div>
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
                    setUserPassword({
                      ...userPassword,
                      current_password: e.target.value,
                    });
                    console.log(userPassword.current_password);
                  }}
                  className={`w-[24vh] h-[4vh] border-2 text-black border-green-800 flex justify-center items-center !p-4 outline-0`}
                  type="password"
                />
              </div>
              <div className="flex items-center gap-4">
                <input
                  placeholder="New Password"
                  onChange={(e) => {
                    setUserPassword({
                      ...userPassword,
                      new_password: e.target.value,
                    });
                    console.log(userPassword.new_password);
                  }}
                  className={`w-[24vh] h-[4vh] border-2 text-black border-green-800 flex justify-center items-center !p-4 outline-0`}
                  type="password"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-start">
                  <input
                    placeholder="Confirm New Password"
                    onChange={(e) => {
                      setUserPassword({
                        ...userPassword,
                        confirm_new_password: e.target.value,
                      });
                      console.log(userPassword.confirm_new_password);
                    }}
                    className={`w-[24vh] h-[4vh] border-2 text-black border-green-800 flex justify-center items-center !p-4 outline-0`}
                    type="password"
                  />
                  {!newPasswordMatch ? (
                    <PassworMatchCaution text={"New password doesn't match!"} />
                  ) : (
                    ""
                  )}
                </div>
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
                  onClick={handleUpdatePassword}
                  disabled={!updatePassword}
                  className="btn btn-primary w-[24vh] h-[4vh] outline-0 text-2xl font-extralight shadow-none border-0 focus:outline-emerald-400  rounded-none bg-emerald-800"
                  type="button"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <Toaster text={"Positive"} mode={"checkbox"}/> */}
      </div>
    </div>
  );
};

export default UserProfile;
