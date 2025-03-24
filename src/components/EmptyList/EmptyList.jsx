import React from "react";
import styles from "./EmptyList.module.css";
import {FaTimesCircle} from "react-icons/fa";

export  function EmptyList(props) {
    const Icon = props.icon?? <FaTimesCircle/>;
    const message = props.message?? "No Data Found";

  return (
    <div className={styles.empty}>
                    <span className={styles.empty_icon} >
                    {Icon} 
                    </span>
                    <h3>{message}</h3>
    </div>
  );
}