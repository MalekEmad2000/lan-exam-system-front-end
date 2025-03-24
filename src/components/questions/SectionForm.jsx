import React, { useEffect, useState } from "react";
import styles from "./SectionForm.module.css";
import ToggleSwitch from "../ui/ToggleSwitch";


function SectionForm(props) {
 
    const showDialog = props.showDialog;
    const setShowDialog = props.setShowDialog;
  
   
    
  

    const handleSubmit = (e) => {

        console.log(props);
        e.preventDefault();
        if(props.mode!=="edit")
        props.addSection();
        else
        props.updateSection()
        setShowDialog(false);
    };
    return (
        <div>

            {showDialog && (
                <div className={styles.dialog}>
                    <div className={styles.dialogContent}>
                        {props.mode !== "edit" ? <h2>Enter section details</h2> :<h2>Edit</h2> }
                        <form name="professorForm" onSubmit={handleSubmit}>
                            <label name="professorLabel" htmlFor="name">section name:</label>
                            <input inputName="professorInput" onChange={(e)=>(props.setSectionName(e.target.value))}
                                type="text"
                                id="name"
                                name="name"
                                required
                                defaultValue={props.mode==="edit"?props.selectedQuestion.title:""}
                              
                            />
                        <label name="shuffle">Shuffle: </label><div name="shuffle"><ToggleSwitch  checked={props.shuffle} setChecked={props.setShuffle} /></div>
                         <button name="professorSubmit" type="submit">{props.mode!=="edit"?"Add section":"Update"}</button>     
                        </form>
                        <button className={styles.closeBtn} onClick={() => setShowDialog(false)}>
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SectionForm;
