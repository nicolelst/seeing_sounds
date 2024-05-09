import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // NOTE: strict mode causes components to double render in dev mode https://stackoverflow.com/a/65167384
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
