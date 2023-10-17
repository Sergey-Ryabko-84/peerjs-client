import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Main, NotFound, Room } from "./components";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Main} />
        <Route path="/room/:roomId" Component={Room} />
        <Route path="*" Component={NotFound} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
