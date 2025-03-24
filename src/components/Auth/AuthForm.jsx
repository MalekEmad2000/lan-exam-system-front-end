import { useState,useRef, } from 'react';
import {useNavigate} from "react-router-dom"
import classes from './AuthForm.module.css';
import { baseURL } from '../store/Authentication';
import MessageModal, { MessageTypes } from '../Message/Message';
const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const emailInputRef=useRef();
  const passwordInputRef=useRef();
  const [isLoading ,setIsLoading]=useState(false);
  const [errorMessage ,setErrorMessage]=useState(null);
  const navigate=useNavigate();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler=async (event)=> {

           event.preventDefault();
           const enteredEmail=emailInputRef.current.value;
           const enteredPassword=passwordInputRef.current.value;


           // add validation here before api call if requeired
          setIsLoading(true);
          let url;
           // login
           if(isLogin){

               url=baseURL+"/auth/login";
           }
       
           const res = await fetch(url, {
                method:  'POST',
                body : JSON.stringify({


                       email : enteredEmail,
                       password : enteredPassword,
                  
                }),
                 headers :{
                   'Content-Type': "application/json"
                 }

           });
           const resData = await res.json();
           if(res.ok){
            setIsLoading(true);
            localStorage.setItem('token',resData.token);
            localStorage.setItem('id',resData.data.id);
            localStorage.setItem('name',resData.data.name);
            localStorage.setItem('email',resData.data.email);
            localStorage.setItem('admin',resData.data.is_admin);
           navigate('/home')
           }else{
            setIsLoading(false);  
                const errorMessage = resData.message || "Error getting students";
                // alert(errorMessage);
                setErrorMessage(errorMessage);

           }    
           setIsLoading(false);  

  };
  
  return (
    <>
    {errorMessage &&
     <MessageModal message={errorMessage} onButtonClicked={()=>{setErrorMessage(null)}} 
     type={MessageTypes.ERROR}
      />}
    <section className={classes.auth}>
      <h1>{isLogin ? 'Lan Exam Maker Login' : 'Sign Up'}</h1>
      <div className={classes.imgDiv}> 
      <img className={classes.authimg}  src={require("../images/alexandriaUniversity.png")} alt="Mountain"/>
      </div>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>loading.......</p>}
          {false &&<button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>}
        </div>
      </form>
    </section>
    </>
  );
};

export default AuthForm;
