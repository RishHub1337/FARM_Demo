import { useState } from "react";
import "./App.css";
import Header from "./components/pages/Header";
import { Routes, Route } from "react-router-dom";
import SignUp from "./components/pages/SignUp";
import SignIn from "./components/pages/SignIn";
import EmailVerification from "./components/pages/EmailVerification";
import Dashboard from "./components/pages/Dashboard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      {/* // setting bg for web app */}
      <div className="relative min-h-screen w-full bg-[linear-gradient(149deg,rgba(13,13,13,1)_0%,rgba(8,92,36,1)_84%,rgba(0,0,0,1)_100%)] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 backdrop-blur-3xl bg-black/30">
          <div className="h-screen flex flex-col">
            <header className="h-[8vh]">
              <Header />
            </header>
            <main className="flex-1 min-h-0 overflow-auto">
              <Routes>
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route
                  path="/email-verification"
                  element={<EmailVerification />}
                />
                <Route path="/dashboard" element={<Dashboard/>}/>
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
