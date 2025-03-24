import React, { useState } from 'react';
import ReactSwitch from 'react-switch';

function ToggleSwitch(props) {
  

  const handleChange = () => {
 
   
    props.setChecked(!props.checked);
    console.log(props.checked);
  
  }

  return (
    <div className="app" style={{textAlign: "center"}}>
      <ReactSwitch
        checked={props.checked}
        onChange={handleChange}
      />
    </div>
  );
}

export default ToggleSwitch;