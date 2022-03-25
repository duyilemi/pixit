import React, { useState, useRef, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";

import { Sidebar, UserProfile } from "../components";
import MyLogo from "../assets/pixit2.png";
import { client } from "../client";
import Pins from "./Pins";
import { userQuery } from "../utils/data";

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  const userInfo =
    localStorage.getItem("user") !== undefined
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  useEffect(() => {
    const query = userQuery(userInfo?.googleId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col      h-screen transition-height duration-75 ease-out ">
      <div className="hidden md:flex h-screen flex-initial ">
        <Sidebar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row ">
        <div className="p-2 w-full flex flex-row justify-between shadow-md items-center">
          <HiMenu
            className=" cursor-pointer "
            fontSize={40}
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/">
            <img src={MyLogo} alt="mylogo" className="w-28" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="mylogo" className="w-10" />
          </Link>
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in ">
            <div className="absolute w-full flex justify-end items-center p-2 ">
              <AiFillCloseCircle
                className="cursor-pointer "
                fontSize={30}
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>
      <div className="flex-1 h-screen pb-2 overflow-y-scroll  " ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
