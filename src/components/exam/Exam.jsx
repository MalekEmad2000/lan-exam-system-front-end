import classes from "./Exam.module.css"
import  {useNavigate}    from "react-router-dom"
import { baseURL } from "../store/Authentication";
import { ExamStatus, requestHeader } from "../constants";
import {  useState } from "react";
import YesNoModal from "../Modal/YesNoModal";
import { FaCopy} from "react-icons/fa";
import { wait } from "@testing-library/user-event/dist/utils";
function Exam(props){
  const navigate=useNavigate();
  const [examStatus,setExamStatus]=useState(props.status);
  const [isModalOpen,setIsModalOpen]=useState(false);
  const [modalData,setModalData]=useState({
    title:"",
    message:"",
    onYes:()=>{},
    onNo:()=>{},
    onCancel:()=>{}
  });
  const [isCopied,setIsCopied]=useState(false);

  
  function ExamDetails(examId,totalPoints){
    navigate('/'+examId+'/ExamDetails/',{state:{totalPoints}});
  }

// add new question to exam 
function addQuestions(){

  const examData ={

    name: props.name,
    id :props.id,
    courseID:props.courseID
    
    }


navigate('/sections/'+examData.id+'/'+examData.courseID);
 

}
// delete exam with id props.id
async function Delete(){
  setModalData({
    title:"Delete Exam",
    message:"Are you sure you want to delete this exam? This will delete all questions and students answers related to this exam.",
    onYes: ()=>{props.delete(props.id);},
    onNo:()=>{setIsModalOpen(false)},
    onCancel:()=>{setIsModalOpen(false)}
  });
  setIsModalOpen(true);

}
// start exam logic
async function startExam(){
  try{
  const response = await fetch(baseURL + "/exams/" + props.id + "/start", {
    method: "PUT",
    headers: requestHeader,
  });
  const resData = await response.json();
  if (response.ok) {
    setExamStatus(resData.data.status);
    props.setRefetch(!props.refetch)
  } else {
    const errorMessage = resData.message || "Error starting exam";
    alert(errorMessage);
  }
} catch (err) {
  console.log(err);
  alert("Error starting exam");
}
}
// edit exam properties
function editExam(){

console.log("editing exam of id "+props.id);


}

function confirmStop(){
  setModalData({
    title:"Stop Exam",
    message:"Are you sure you want to stop this exam? This will stop students from answering questions.Can't be undone.",
    onYes: ()=>{stopExam();},
    onNo:()=>{setIsModalOpen(false)},
    onCancel:()=>{setIsModalOpen(false)}
  });
  setIsModalOpen(true);
}

// start exam logic
async function stopExam(){
  try{
    // console.log("stopping exam of id "+props.id);
  const response = await fetch(baseURL + "/exams/" + props.id + "/end", {
    method: "PUT",
    headers: requestHeader,
  });
  const resData = await response.json();
  if (response.ok) {
    console.log(resData);
    setExamStatus(resData.data.status);
    setIsModalOpen(false)
    props.setRefetch(!props.refetch);
  } else {
    const errorMessage = resData.message || "Error starting exam";
    alert(errorMessage);
  }
} catch (err) {
  console.log(err);
  alert("An error occured while stopping exam");
}
}
// edit exam properties
function editExam(){

console.log("editing exam of id "+props.id);


}

function copyExamLink(examLink){
  // console.log("copying exam link");
  // const examLink = examId;
  navigator.clipboard.writeText(examLink);
  setIsCopied(true);
  setTimeout(()=>{setIsCopied(false)},1000);
}
async function exportExam(){
  const response = await fetch(baseURL + "/exams/" + props.id + "/export", {
    method: "Get",
    headers: requestHeader,
  });
  const data=await response.json();
  if(response.ok){
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    link.click();
  }
}

return (
<>
{isModalOpen && <YesNoModal 
      title= {modalData.title}
      message={modalData.message}
      onYes={modalData.onYes}
      onNo={modalData.onNo}
      onCancel={modalData.onCancel}
      />}

<div className={classes.card}>
<div className={classes.cardHeader}><h3>{props.name} </h3>  </div>
<img name="examIMG" src={require("../images/exam.jpg")} />
<p>Date: {props.startDate}         Start Time: {props.startTime}           End Time: {props.endTime}
{"\n"}Questions Count: {props.questionCount}       Total Points: {props.totalPoints}  
 <span className={isCopied ? classes.copied : classes.copy
 } onClick={()=>copyExamLink(props.examLink)}>
    {isCopied ? "Copied" :  "Copy Link"} <FaCopy/> </span>
    </p>

<PublishButton status={examStatus} onPublish={startExam} onStop={confirmStop}/>
<div name="cardBtns">
<button name="cardBtns" onClick={addQuestions}>Add Questions</button>
<button name="cardBtns" onClick={()=>ExamDetails(props.id,props.totalPoints)}>Details</button>
<button name="cardBtns" onClick={Delete}>Delete</button>
<button name="cardBtns" onClick={exportExam}>Export</button>
</div>
</div>
</>



)



 



}
  export default Exam;

  function PublishButton(props){
    const status = props.status;
    if(status === ExamStatus.NOT_STARTED){
      return <button name="publishBtn" onClick={props.onPublish}>Publish</button>
    }
    else if(status === ExamStatus.ONGOING){
      return <button name="stopBtn" onClick={props.onStop}>Stop</button>
    }
    else if(status === ExamStatus.COMPLETED){
      return <button name="completedBtn" disabled={true}>Completed</button>
    }

  }
   