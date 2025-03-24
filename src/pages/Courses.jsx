import "./Courses.module.css"; 
import {useParams} from 'react-router-dom';
import {Navigate, useNavigate}  from "react-router-dom"
import {useEffect,useState} from 'react'
import TextField from '@mui/material/TextField'
import { getAuthToken ,baseURL,isAdmin} from "../components/store/Authentication";
import Loading from "../components/Loading/Loading"
import DataTable from "react-data-table-component";
import MessageModal, { MessageTypes } from "../components/Message/Message";

function Courses(props){

  const [courses,setCourses]=useState([]);
  const navigate=useNavigate();
  const [isLoading ,setIsLoading]=useState(true);
  const [courseName,setCourseName]=useState();
  const [courseCode,setCourseCode]=useState();
  const [refetch,setRefetch]=useState(false);
  const admin=isAdmin();
  const [message, setMessage] = useState(null);
  const [messageType , setMessageType] = useState(null);
  const [onMessageBtnClick, setOnMessageBtnClick] = useState(() => {});

function changeHandler(event){
    if(event.target.name ==='courseName')
    setCourseName(event.target.value);
    else
        setCourseCode(event.target.value);
    
}

useEffect(()=>{

  setIsLoading(true);

  fetch(baseURL+"/courses",{
    method:'GET',
    headers :{

      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +getAuthToken()


    }



  }).then((response)=>{

    return response.json();




    }).then(data=>{

    const transformedCourses=data.data.map(course=>{

    return {

       code:course.course_id,
       name:course.course_name,

    }


    })

    setIsLoading(false);
    setCourses(transformedCourses);
    

    });


},[refetch])

  // course insertion

  async function submitCourse(){

    
    setRefetch(!refetch);
  try{
   const res = await fetch(baseURL+"/courses",
      {
      method: 'POST',
      body: JSON.stringify({
        course_id: courseCode,
        course_name: courseName
      }),
      headers : {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' +getAuthToken()
      }
      }
      );
      if(res.status=== 200 || res.status===201){
        // alert("Question added successfully");
        setMessageType(MessageTypes.SUCCESS);
        setMessage("Course added successfully");
        setOnMessageBtnClick( () => () => setMessage(null));
        // navigate(`/questionbank/${courseID}`);
    }
    else{
        // alert(data.message);
        setMessageType(MessageTypes.ERROR);
        setOnMessageBtnClick(() => () => setMessage(null));
        setMessage(data.message);
    }}
    catch(err){
        // alert("Something went wrong");
        setMessageType(MessageTypes.ERROR);
        setOnMessageBtnClick(() => () => setMessage(null));
        setMessage("Something went wrong");
    }

 }
 
  const columns = [
    {
        name : "Course",
        selector: (row) => row.name
    },
    {
        name : "Code",
        selector: (row) => row.code
    }
];

  const data = [
 
  ]
  if(isLoading){
    return  <Loading/>
  }else
  return(
  <div>
  {message && <MessageModal message={message}  type={messageType} onButtonClicked={onMessageBtnClick}/>}
  {admin &&
  <div name="addCourseDiv">
  <h1 name="addCourseTitle">Add a New Course: </h1>
  <TextField name="courseName" label="Course Name" variant="outlined" onChange={changeHandler}/><span/>
  <TextField name="courseCode" label="Course Code" variant="outlined" onChange={changeHandler} /><span/>
  <span/><span/><span/><span/><span/><span/><span/><span/><button onClick={submitCourse} name="addCourse">Add New Course</button> 
  </div>
  }
  <table>
    <thead>
        <tr>
          <th>Course</th>
          <th>Code</th>
        </tr>
    </thead>
    <tbody>
        {courses.map((course) => {
          return (
            <tr key={course.code}>
              <td >{course.name}</td>
              <td >{course.code}</td>
            </tr>
          )
        })}
      </tbody>
      </table>
     
      {/* <div name="resultsTable">
        <DataTable
        title = "Courses"
        columns={columns}
        data = {courses}
        progressPending = {isLoading}
        paginationRowsPerPageOptions = {[5,10,15,20]}
        paginationPerPage = {10}
        pagination
        />
    </div> */}

  </div>
  )
}
 


export default Courses;