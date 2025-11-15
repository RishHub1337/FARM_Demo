import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  if (!location.state?.allowed) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex h-auto justify-center items-center text-emerald-100 text-4xl font-extralight">
        You will see something interesting here once you login/signup!
      </div>
    </div>
  );
};

export default Dashboard;
