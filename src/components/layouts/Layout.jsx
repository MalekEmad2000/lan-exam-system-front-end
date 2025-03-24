import  "./Layout.css"
import MainNavigation from "./MainNavigation";
import { logout,getUserName } from "../store/Authentication";
import {useNavigate,Outlet} from 'react-router-dom'
import { useEffect } from "react";
import { getAuthToken ,getUser} from "../store/Authentication";
import { useLocation } from 'react-router-dom';

function Layout(props){
  const navigate=useNavigate();
  // get token from local storage
  // if token is not present, redirect to login page
  // if token is present, redirect to home page
  const token = getAuthToken();
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token]);


function logoutHandler(){


logout();

navigate("/");

}

const { pathname } = useLocation();
var title = "Mobile Exam Maker";

if (pathname == "/home")
  title="Mobile Exam Maker / All Exams"
else if (pathname == "/newexam")
  title="Mobile Exam Maker / Add New Exam"
else if (pathname == "/questionBank")
  title="Mobile Exam Maker / Question Bank"
else if (pathname == "/Courses")
  title="Mobile Exam Maker / Courses"
else if (pathname == "/Results")
  title="Mobile Exam Maker / Results"
else if (pathname == "/students")
  title="Mobile Exam Maker / Students"
else if (pathname == "/profile")
  title="Mobile Exam Maker / Profile"
else if (pathname == "/professors")
  title="Mobile Exam Maker / Professors"
else if (pathname == "/sections")
  title="Mobile Exam Maker / Exam Sections"
else if (pathname == "/newQuestion/:examId")
  title="Mobile Exam Maker / Add New Question"
else if (pathname == "/ExamQuestions/:examId")
  title="Mobile Exam Maker / Exam Questions"

return(

<div className='container'> 
<div className='logo'></div>
<div className='header'>
<header>

<h1 name="title">{title}</h1>

</header>


<div name="accountRoot">
  <div name="accountHead">
    <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" /*crossOrigin*/ />
    <link 
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
    <link  
      href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
      rel="stylesheet"
    />
    <link  rel="stylesheet" href="styles.css" />
  </div>
  <div name="accountBody" >
    <nav name="account" >
      <ul name="account" >
        <div name="account" >
          <label name="account" >{getUserName()}</label>
        </div>
        <li name="account">
          <img name="account" src={require('../images/profile.png')} className="profile" />
          <ul name="account" >
            <li name="account" className="sub-item" >
              <a href="/profile"  className="prof_link">
              <span name="account" className="material-icons-outlined"> person </span>
              <p name="account">Profile</p>
              </a>
            </li>

            <li onClick={logoutHandler} name="account" className="sub-item">
              <span name="account" className="material-icons-outlined"> logout </span>
              <p name="account">Logout</p>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</div>


</div>
<div className='nav'>
  <MainNavigation/>
</div>
<div className='content'>
   <Outlet/>  
</div>
</div>

)

}
export default Layout;