import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<p>App</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
