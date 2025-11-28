import { useState } from "react";
import "./App.css";
import Header from "./components/pages/Header";
import { Routes, Route } from "react-router-dom";
import SignUp from "./components/pages/SignUp";
import SignIn from "./components/pages/SignIn";
import EmailVerification from "./components/pages/EmailVerification";
import Dashboard from "./components/pages/dashboard/Dashboard";
import AuthLayout from "./components/layout/AuthLayout";
import DummyTest from "./components/pages/DummyTest";
import SubmitBio from "./components/pages/SubmitBio";

function App() {
  return (
    <div className="min-h-screen w-full bg-[linear-gradient(149deg,rgba(13,13,13,1)_0%,rgba(8,92,36,1)_84%,rgba(0,0,0,1)_100%)] bg-cover bg-center bg-no-repeat">
      <div className="min-h-screen w-full backdrop-blur-3xl bg-black/30">
        <Routes>
          <Route path="/" element={<AuthLayout></AuthLayout>} />
          <Route
            path="/sign-up"
            element={
              <AuthLayout>
                <SignUp />
              </AuthLayout>
            }
          />
          <Route
            path="/sign-in"
            element={
              <AuthLayout>
                <SignIn />
              </AuthLayout>
            }
          />
          <Route
            path="/email-verification"
            element={
              <AuthLayout>
                <EmailVerification />
              </AuthLayout>
            }
          />
          <Route
            path="/submit-bio"
            element={
              <AuthLayout>
                <SubmitBio />
              </AuthLayout>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dummy" element={<DummyTest />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
