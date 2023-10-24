import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { RoomProvider } from "./context/RoomContext";
import { Home } from "./pages/Home";
import { Room } from "./pages/Room";
import { UserProvider } from "./context/UserContext";
import { ChatProvider } from "./context/ChatContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <RoomProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/room/:id"
              element={
                <ChatProvider>
                  <Room />
                </ChatProvider>
              }
            />
          </Routes>
        </RoomProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
