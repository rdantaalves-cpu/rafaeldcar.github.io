import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Aplicativo from "./App.jsx";
import "./style.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Aplicativo />
  </StrictMode>,
);