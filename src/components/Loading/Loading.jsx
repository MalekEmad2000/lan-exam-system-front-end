import React from "react";
import cssModules from "./Loading.module.css";
export default function Loading() {
  return (
    <div className={cssModules.loading_dialog}>
            <div className={cssModules.spinner}></div>
            <div className={cssModules.message}>Loading...</div>
        </div>
  );
}