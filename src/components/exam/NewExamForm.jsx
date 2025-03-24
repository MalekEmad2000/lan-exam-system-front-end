import Card from "../ui/Card";
import classes from "./NewExamForm.module.css"
import {useRef,useEffect, useState} from "react"
import Select from 'react-select';
import { baseURL,getAuthToken } from "../store/Authentication";
import Loading from "../Loading/Loading";

function NewExamForm(props){

const [courses,setCourses]=useState([]);
const [selectedCourse,setSelectedCourse]=useState();
const [selectedCourseName,setSelectedCourseName]=useState("Select...");
const[isLoading,setIsLoading]=useState(false);
const exam = props.exam;
 

async function loadCourses(){

setIsLoading(true);
const response= await fetch(baseURL+'/courses',{

method:"GET",
headers:{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' +getAuthToken()
}
})

const data=await response.json();
const transformedCourses=data.data.map(course=>{
  if(exam){
    if(course.course_id===exam.course_id){
      setSelectedCourse(course.course_id);
      setSelectedCourseName(course.course_name);
    }
  }
  return {

     label:course.course_name+" "+course.course_id,
     value:course.course_id,
   

  }


  })

setCourses(transformedCourses);
setIsLoading(false);
}


useEffect(()=>{loadCourses(); },[]);

 const nameRef=useRef();
 const startDateRef=useRef();
 const startTimeRef=useRef();
 const endTimeRef=useRef();
 const instructionsRef=useRef();
 const minSubmitTimeRef=useRef();
 const maxAttemptsRef=useRef();
 const passwordRef=useRef();

  

 
function createNewExam(event){


event.preventDefault();
const enteredName=nameRef.current.value;
const enteredStartDate=startDateRef.current.value;
const enteredStartTime=startTimeRef.current.value;
const enteredEndTime=endTimeRef.current.value;
const enteredInstructions=instructionsRef.current.value;
const enteredMinSubmitTime=minSubmitTimeRef.current.value;
const enteredMaxAttempts=maxAttemptsRef.current.value;
const enteredPassword=passwordRef.current.value;

 
const examData ={

  "name":enteredName,
  "start_date":enteredStartDate,
  "start_time":enteredStartTime,
  "end_time":enteredEndTime,
  "exam_instructions":enteredInstructions,
  "min_submit_time":enteredMinSubmitTime,
  "max_attempts":enteredMaxAttempts,
  "course_id": selectedCourse,
  "exam_password":enteredPassword
  
}

props.createExam(examData);
    
}

if(isLoading) return <Loading/>;
else
return (

<div name="examForm">
<Card>
<form className={classes.form}  onSubmit={createNewExam}>
<div className={classes.control}>
<label htmlFor="course" >Course Name</label>
<div name="select">
<Select onChange={(e)=>{setSelectedCourse(e.value); setSelectedCourseName(e.label);}}   styles={{
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderColor: state.isFocused ? 'grey' : 'black',
    }),
  }} options={courses} value={{label: selectedCourseName, value: courses.filter(course=>course.value===exam?.course_id)}}/>
</div>
</div>
<div className={classes.control}>
<label htmlFor="name" >Exam Name</label>
<input type="text" required id="name" ref={nameRef} defaultValue={exam?.name} />
</div>
<div className={classes.control}>
<label htmlFor="password" >Exam password</label>
<input type="text" required id="password" ref={passwordRef}  defaultValue={exam?.exam_password} />
</div>
<div className={classes.control}>
<label htmlFor="startDate" >Exam Date</label>
<input type="date" required id="StarDate" ref={startDateRef} defaultValue={convertDateFormat(exam?.start_date)}/>
</div>
<div className={classes.control}>
<label htmlFor="startTime" >Start Time</label>
<input type="time" required id="stratTime" ref={startTimeRef} defaultValue={convertTime12to24(exam?.start_time)}/>
</div>
<div className={classes.control}>
<label htmlFor="endTime" >End Time</label>
<input type="time" required id="endTime" ref={endTimeRef} defaultValue={convertTime12to24(exam?.end_time)}/>
</div>
<div className={classes.control}>
<label htmlFor="minSubmitTime" >Minimum Submit Time</label>
<input type="time" required id="minSubmitTime" ref={minSubmitTimeRef} defaultValue={convertTime12to24(exam?.min_submit_time)}/>
</div>
<div className={classes.control}>
<label htmlFor="maxAttempts" >Maximum Number of Attempts</label>
<input type="number" min="1" required id="maxAttempts" ref={maxAttemptsRef} defaultValue={exam?.max_attempts}/>
</div>
<div className={classes.control}>
<label htmlFor="instructions" >Exam Instructions</label>
<textarea rows="4" resize="none" required id="instructions" ref={instructionsRef} defaultValue={exam?.exam_instructions}/>
</div>
<div className={classes.actions}>
<button>{exam ? 'Update Exam' : 'Create Exam'}</button>
</div>
</form>
</Card>
</div>

)

}

export default NewExamForm;

const convertTime12to24 = (time12h) => {
  if(!time12h){
    return;
  }
  const [time, modifier] = time12h.split(' ');

  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
}

const convertDateFormat = (date) => {
  if(!date){
    return;
  }
  // console.log(date);
  const [day,month,year] = date.split('-');
  return `${year}-${month}-${day}`;
}