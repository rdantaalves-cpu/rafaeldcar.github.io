import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Aplicativo from "./EstudioApp.jsx";
import "./estudio.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Aplicativo />
  </StrictMode>,
);