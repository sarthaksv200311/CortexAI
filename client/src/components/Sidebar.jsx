import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";
import { Navigate } from "react-router-dom";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    chats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    user,
    navigate,
  } = useAppContext();
  const [search, setSearch] = useState("");

  return (
    <div>
      {/* Logo */}
      <div
        className={`flex flex-col h-screen min-w-72 p-5 dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-10 ${!isMenuOpen && `max-md:-translate-x-full`}`}
      >
        <img
          src={
            theme === "dark" ? assets.cortexai_logo_light : assets.cortexai_logo
          }
          alt="logo"
          className="w-full max-w-48"
        />

        {/* New chat button */}
        <button
          onClick={() => {
            navigate("/");
            setSelectedChat(null);
          }}
          className="flex justify-center items-center w-full py-2 mt-3 text-white bg-gradient-to-r from-indigo-500 to-emerald-500 text-sm rounded-lg cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all"
        >
          <span className="mr-2 text-xl">+</span> New Chat
        </button>

        {/* Search Conversation */}
        <div className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md">
          <img
            src={assets.search_icon}
            className="w-4 not-dark:invert"
            alt=""
          />
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Search Conversations"
            className="text-xs placeholder:text-gray-400 outline-none bg-transparent w-full"
          />
        </div>

        {/* Recent Chats */}
        {chats.length > 0 && <p className="mt-4 text-sm">Recent chats</p>}

        <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3">
          {chats
            .filter((chat) =>
              chat.messages[0]
                ? chat.messages[0]?.content
                    .toLowerCase()
                    .includes(search.toLowerCase())
                : chat.name.toLowerCase().includes(search.toLowerCase()),
            )
            .map((chat) => (
              <div
                onClick={() => {
                  navigate("/");
                  setSelectedChat(chat);
                  setIsMenuOpen(false);
                }}
                key={chat._id}
                className="p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#80609F]/15 rounded-md cursor-pointer flex justify-between group"
              >
                <div>
                  <p className="truncate w-full">
                    {chat.messages.length > 0
                      ? chat.messages[0].content.slice(0, 32)
                      : chat.name}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
                    {moment(chat.updatedAt).fromNow()}
                  </p>
                </div>

                <img
                  src={assets.bin_icon}
                  className="hidden group-hover:block w-4 cursor-pointer not-dark:invert"
                  alt=""
                />
              </div>
            ))}
        </div>
        {/*Community Image */}
        <div
          onClick={() => {
            navigate("/community");
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all"
        >
          <img
            src={assets.gallery_icon}
            className="w-4.5 not-dark:invert"
            alt=""
          />
          <div className="flex flex-col text-sm">
            <p>Community Images</p>
          </div>
        </div>
        {/*Credit Purchase Option*/}
        <div
          onClick={() => {
            navigate("/credits");
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all"
        >
          <img src={assets.diamond_icon} className="w-4.5 dark:invert" alt="" />
          <div className="flex flex-col text-sm">
            <p>Credits : {user?.credits}</p>
            <p className="text-xs text-gray-400">
              Purchase credits to use CortexAI
            </p>
          </div>
        </div>
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md">
          <div className="flex items-center gap-2 text-sm">
            <img
              src={assets.theme_icon}
              alt=""
              className="w-4 not-dark:invert"
            />
            <p>Dark Mode</p>
          </div>
          <label className="relative inline-flex cursor-pointer">
            <input
              onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              type="checkbox"
              className="sr-only peer"
              checked={theme === "dark"}
            />
            <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
          </label>
        </div>
        {/* User Account */}
        <div className="flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group">
          <img src={assets.user_icon} className="w-7 rounded-full" alt="" />
          <p className="flex-1 text-sm dark:text-primary truncate">
            {user ? user.name : "Login your account"}
          </p>
          {user && (
            <img
              className="h-5 cursor-pointer hidden not-dark:invert group-hover:block max-md:block"
              src={assets.logout_icon}
            />
          )}
        </div>
        <img
          onClick={() => setIsMenuOpen(false)}
          src={assets.close_icon}
          className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert"
          alt=""
        />
      </div>
    </div>
  );
};

export default Sidebar;
