import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { GlobalSearchProvider } from "./GlobalSearchContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalSearchProvider>
        <App />
      </GlobalSearchProvider>
    </BrowserRouter>
  </React.StrictMode>
);