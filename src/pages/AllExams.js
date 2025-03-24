import classes from "./AllExams.module.css"
import {Navigate, json, useNavigate}  from "react-router-dom"
import Exam from "../components/exam/Exam";
import {useEffect,useState} from 'react'
import { getAuthToken ,baseURL} from "../components/store/Authentication";
import Loading from "../components/Loading/Loading";
import { EmptyList } from "../components/EmptyList/EmptyList";
import MessageModal, { MessageTypes } from "../components/Message/Message";
import { requestHeader } from "../components/constants";


function AllExams(props){
const [searchKey,setSearchKEY]=useState('');
const [exams,setExams]=useState([]);
const [isLoading ,setIsLoading]=useState(true);
const navigate=useNavigate();
const token=getAuthToken();        // attach this token with all requests get it by importing get authtoken and using it like in line 6
//console.log(token);
const [error,setError]=useState(null);
const [selectedFile, setSelectedFile] = useState(null);
const [refetch,setRefetch]=useState(false);
const [jsonData,setJsonData]=useState()
const [message, setMessage] = useState(null);
const [messageType, setMessageType] = useState(MessageTypes.ERROR);
const [onMessageBtnClick, setOnMessageBtnClick] = useState(() => {});
 



  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;
      const jsonData = JSON.parse(fileContent); 
      setJsonData(jsonData);
      console.log(jsonData);
    };
    file && reader.readAsText(file);
  };

 


useEffect(()=>{

    setIsLoading(true);
  
    fetch(baseURL+"/exams",{
      method:'GET',
      headers :{

        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +token


      }
  
    }).then((response)=>{
      
      return response.json();
     
      
      }).then(data=>{
        // console.log(data.data);

      const trasnforomedExam=data.data.map(exam=>{
        // console.log(exam);
      return {

         id:exam.id,
         name:exam.name,
         start_date:exam.start_date,
         start_time:exam.start_time,
         end_time:exam.end_time,
         status:exam.status,
         courseID:exam.course_id,
         questionCount:exam.questions_count,
         totalPoints:exam.total_weight,
         examLink:exam.exam_link
      }


      });
      // console.log(trasnforomedExam);
       
      setIsLoading(false);
      setExams(trasnforomedExam);
      // console.log(exams);
       
      
      });
  
  
  },[refetch])


    function showNewExamForm(){
     
    navigate("/newexam");

    }



    async function deleteExam(examID){

      const response=await fetch(baseURL+'/exams/'+examID,{
        method:'DELETE',
        body:json.stringi,
        headers:{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' +getAuthToken()
        }
        
        });
        // console.log(response)
        if(response.ok){
        setExams(exams.filter((exam) => exam.id !== examID));
        const data= await response.json();  // dont forget error handling
        }
        else if(response.status===401){
          // alert("You are not allowed to delete this exam")
          setError("You are not allowed to delete this exam")
        }
        else{
          setError("Exam deletion failed");
        }

        
        


    }
    async function importExam(){

        setIsLoading(true)

   
      const response = await fetch(baseURL + "/exams/import", {
        method: "POST",
        body:JSON.stringify(jsonData),
        headers: requestHeader,
      });
      
      
    const data=await response.json();
    if(response.ok){
      setMessageType(MessageTypes.SUCCESS);
      setMessage("exam imported successfully");
      setOnMessageBtnClick(() => () => setMessage(null));
      setRefetch(!refetch)
    }else{

      setMessageType(MessageTypes.ERROR);
      setOnMessageBtnClick(() => () => setMessage(null));
      setMessage(data.message);

    }     
         setSelectedFile("");
         setIsLoading(false)
    }
useEffect(()=>{
console.log(selectedFile)
},[selectedFile])

    function resetSearchField(){

      setSearchKEY("");
      
    }


    if(isLoading){


       return   <Loading/>
        
        }
 else
return (
  <>
  {error && <MessageModal message={error} onClose={()=>setError(null)} type={MessageTypes.ERROR}/>}
  
<div>
  <div className={classes.actions}> <div name="actionDivExams">
   
  
  <button onClick={showNewExamForm}>Add a New Exam</button>
  <input className={classes.fileInput}  id="file"  type="file"   onChange={handleFileChange}/>
  <label for="file" className={classes.fileLabel}>Import Exam   </label>
  {selectedFile &&
  <> 
  <button name="importButton" onClick={importExam}>import {selectedFile.name}</button>
  <button name="cancel" onClick={()=>setSelectedFile("")}>&times;</button>
  
  </>
  }
  

  <form name="searchExams">   
        <input value={searchKey} type="searchExams" onChange={(e)=>setSearchKEY(e.target.value)} placeholder="Search Exams..." required/>
        <button name="searchExams" onClick={resetSearchField} type="button" >
        <svg color="red" width="30" height="30" fill="currentColor" className="bi bi-search" viewBox="0 0 16 15">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
        </button>
        
  </form>
  </div>
</div>



{
    exams.length===0 ? <EmptyList message="No Exams Found"/> :
exams.filter((exam)=>exam.name.includes(searchKey)).map(exam => <Exam
 
 key={exam.id}
 id={exam.id}
 name={exam.name}
 startDate={exam.start_date}
 startTime={exam.start_time}
 endTime={exam.end_time}
 status={exam.status}
 courseID={exam.courseID}
 questionCount={exam.questionCount}
 totalPoints={exam.totalPoints}
 examLink={exam.examLink}
 delete={deleteExam}
 refetch={refetch}
 setRefetch={setRefetch}

/>)}

{message && <MessageModal message={message}  type={messageType} onButtonClicked={onMessageBtnClick}/>}
</div>
</>


 

)


}

export default AllExams;