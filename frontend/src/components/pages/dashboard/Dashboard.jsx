import React, { useEffect, useState } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import Home from "./Home";
import Message from "./Message";
import Notification from "./Notification";
import StaffManagement from "./StaffManagement";
import MakePayment from "./MakePayment";
import UserProfile from "./UserProfile";
import Loader from "../../styleComponent/Loader.jsx";
import ApiManager from "../../../apiManager/ApiManager.js";

const Dashboard = () => {
  const [uniqueId, setUniqueId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [portionState, setPortionState] = useState({
    homePortion: true,
    messagePortion: false,
    notificationPortion: false,
    staffPortion: false,
    paymentPortion: false,
    userPortion: false,
  });

  const handlePortionSelection = (portionName) => {
    if (portionName === "home") {
      setPortionState({
        homePortion: true,
        messagePortion: false,
        notificationPortion: false,
        staffPortion: false,
        paymentPortion: false,
        userPortion: false,
      });
    } else if (portionName === "message") {
      setPortionState({
        homePortion: false,
        messagePortion: true,
        notificationPortion: false,
        staffPortion: false,
        paymentPortion: false,
        userPortion: false,
      });
    } else if (portionName === "notification") {
      setPortionState({
        homePortion: false,
        messagePortion: false,
        notificationPortion: true,
        staffPortion: false,
        paymentPortion: false,
        userPortion: false,
      });
    } else if (portionName === "staff") {
      setPortionState({
        homePortion: false,
        messagePortion: false,
        notificationPortion: false,
        staffPortion: true,
        paymentPortion: false,
        userPortion: false,
      });
    } else if (portionName === "payment") {
      setPortionState({
        homePortion: false,
        messagePortion: false,
        notificationPortion: false,
        staffPortion: false,
        paymentPortion: true,
        userPortion: false,
      });
    } else if (portionName === "userProfile") {
      setPortionState({
        homePortion: false,
        messagePortion: false,
        notificationPortion: false,
        staffPortion: false,
        paymentPortion: false,
        userPortion: true,
      });
    }
  };
  useEffect(() => {
    const getUser = async () => {
      try {
        const apiManager = new ApiManager();
        const res = await apiManager.get_user();
        setUniqueId(res.data.unique_id);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);
  return (
    <div>
      <div
        className={` h-screen w-screen flex justify-center items-center ${
          isLoading ? "" : "hidden"
        }`}
      >
        <Loader />
      </div>
      <div className={`bg-none ${isLoading ? "hidden" : ""}`}>
        <div className="text-white h-[8vh] flex justify-center items-center text-3xl">
          {/* <marquee behavior="" direction=""> */}
          Farm Demo
          {/* </marquee> */}
        </div>
        <div className="grid sm:grid-cols-12 gap-4 h-[calc(100vh-16vh)] opacity-90">
          <div
            id="temp"
            className="bg-[#e3e3e1] p-4 shadow rounded sm:col-span-2 flex justify-center items-center text-2xl font-extralight"
          >
            <div className="h-full w-full rounded  !py-4 font-normal">
              <nav className="h-full flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <button
                    draggable="false"
                    to={"#"}
                    onClick={() => handlePortionSelection("home")}
                    className="hover:bg-[#f2f2f2] !px-8 !py-4 !m-2 flex items-center transition-colors duration-300 ease-in-out"
                  >
                    Home
                  </button>
                  <button
                    draggable="false"
                    to={"#"}
                    onClick={() => handlePortionSelection("message")}
                    className="hover:bg-[#f2f2f2] !px-8 !py-4 !m-2  flex items-center transition-colors duration-300 ease-in-out"
                  >
                    Message
                  </button>
                  <button
                    draggable="false"
                    to={"#"}
                    onClick={() => handlePortionSelection("notification")}
                    className="hover:bg-[#f2f2f2] !px-8 !py-4 !m-2  flex items-center transition-colors duration-300 ease-in-out"
                  >
                    Notification
                  </button>
                  <button
                    draggable="false"
                    to={"#"}
                    onClick={() => handlePortionSelection("staff")}
                    className="hover:bg-[#f2f2f2] !px-8 !py-4 !m-2  flex items-center transition-colors duration-300 ease-in-out"
                  >
                    Staff Management
                  </button>
                  <button
                    draggable="false"
                    to={"#"}
                    onClick={() => handlePortionSelection("payment")}
                    className="hover:bg-[#f2f2f2] !px-8 !py-4 !m-2  flex items-center transition-colors duration-300 ease-in-out"
                  >
                    Make Payment
                  </button>
                </div>
                <div>
                  <nav className="h-full flex flex-col">
                    <button
                      draggable="false"
                      onClick={() => handlePortionSelection("userProfile")}
                      className="hover:bg-[#f2f2f2] !px-8 !py-4 !m-2 text-2xl flex gap-4 items-center transition-colors font-normal underline border-2 border-green-800 font-mono max-w-full"
                    >
                      <img
                        className="w-11 h-11 rounded-full border-2 border-green-800 !p-1"
                        src="/src/assets/userImg.jpeg"
                        alt="Rounded avatar"
                      />
                      <div className="flex flex-col items-start">
                        <span className="textarea-xs">UniqueID:</span>
                        <span className="truncate max-w-[250px] block font-bold">
                          @{uniqueId}
                        </span>
                      </div>
                    </button>
                  </nav>
                </div>
              </nav>
            </div>
          </div>
          <div className="bg-[#e3e3e1] p-4 shadow rounded sm:col-span-10 flex justify-center items-center text-2xl font-extralight">
            {portionState.homePortion ? (
              <Home />
            ) : portionState.messagePortion ? (
              <Message />
            ) : portionState.notificationPortion ? (
              <Notification />
            ) : portionState.staffPortion ? (
              <StaffManagement />
            ) : portionState.paymentPortion ? (
              <MakePayment />
            ) : portionState.userPortion ? (
              <UserProfile />
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="text-gray-400 h-[8vh] flex flex-col justify-center items-center text-1xl font-light ">
          This is the Primary Dashboard for Farm Demo Application
          <p className="text-shadow-sm">
            Copywrights reserved{" "}
            <a
              className="underline text-white font-mono"
              href="https://github.com/rishHub1337"
            >
              RishHub1337
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
