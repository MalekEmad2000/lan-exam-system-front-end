import { useState } from "react";
import { baseURL, getAuthToken, getUserEmail, getUserID, getUserName, isAdmin, setUserData } from "../../components/store/Authentication";
import classes from  "./Profile.module.css";
import Card from "../../components/ui/Card";

function Profile(){
  const [user,setUser]=useState({
    name: getUserName(),
    email: getUserEmail(),
    password: "",
    confirmPassword: "",
    id: getUserID(),
    isAdmin : isAdmin()
  });

const updateProfile = (event)=>{
  event.preventDefault();
  // get all inserted data 
  const name = event.target.name.value;
  const email = event.target.email.value;
  const password = event.target.password.value;
  const confirmPassword = event.target.confirmPassword.value;
  if(password!==confirmPassword)
    {
      alert("Passwrod Doesn't match");
      return;
    }

  // request to update profile
  fetch(baseURL+'/professors/'+getUserID(),{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getAuthToken(),
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      id: user.id,
    })
  }).then((response)=>{
    if(response.ok){
      alert("Profile Updated Successfully");
      setUser({
        name: name,
        email: email,
        id: user.id,
      });
      setUserData(email,user.id,name);
    }
    else{
      alert("Something went wrong");
    }
  });
};



return(
<>
<div name="profileForm">

<Card>

<form className={classes.form}  onSubmit={updateProfile}>
<h1 className={classes.h1}>Welcome, {user.name} </h1>

<label id="email" className={classes.label} >Email *</label>
<input type="email"  id="email"  value={user.email} disabled={true} className={classes.input} required/>
<p>You can't change your email</p>

<label id="name" className={classes.label}>Name *</label>
<input type="text"  id="name" defaultValue ={user.name} className={classes.input} required/>

<label id="password"  className={classes.label}>Password </label>
<input type="password"  id="password"  className={classes.input}/>
<p>Leave it empty if you don't want to change your password</p>

<label id="confirmPassword" className={classes.label}>Confirm Password </label>
<input type="password"  id="confirmPassword"  className={classes.input}/>
<p>Leave it empty if you don't want to change your password</p>




<div className={classes.actions}>
<button>Update My Profile</button>
</div>
</form>
</Card>
</div>


</>
  
)





}
export default Profile;