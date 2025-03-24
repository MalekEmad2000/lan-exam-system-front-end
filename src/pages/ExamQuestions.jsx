import NewQuestionForm from "../components/questions/NewQuestionForm";
import Question from "../components/questions/Question";
import {json, useParams} from 'react-router-dom';
import classes from "./ExamQuestions.module.css";
import  {useState,useEffect} from "react";
import {Navigate, useNavigate }  from "react-router-dom";
import { Dialog } from '@reach/dialog';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import {VisuallyHidden} from '@reach/visually-hidden';
import { baseURL,getAuthToken } from "../components/store/Authentication";
import '@reach/dialog/styles.css';
import '@reach/tabs/styles.css';
import SelectedQuestion from "../components/questions/SelectedQuestion";
import Loading from "../components/Loading/Loading"
import { selectClasses } from "@mui/material";
import MessageModal ,  { MessageTypes } from "../components/Message/Message";
import { EmptyList } from "../components/EmptyList/EmptyList";


function ExamQuestions(props){

 // you can access exam id here using props.selectedExam.id

 const [questions,setQuestions]=useState([]);
 const [bankQuestions,setBankQuestoins]=useState([]);
 const [selecetdQuestions,setSelecetdQuestions]=useState([]);
 const [isLoading ,setIsLoading]=useState(true);
 const [showModal, setShowModal] = useState(false);
 const [showEditPage,setShowEditPage] = useState(false);
 const [fetchQuestions,setFetchQuestions]=useState(false);
 const [filterValue,setFilterValue]=useState("any");
 const [editedQuestion,setEditedQuestion]=useState();
 const [questionId,setQuestionId]=useState();
 const [searchKey,setSearchKEY]=useState('');
 const [bankSearchKey,setBankSearchKEY]=useState('');
 const [message, setMessage] = useState(null);
 const [messageType, setMessageType] = useState(MessageTypes.ERROR);
 const [onMessageBtnClick, setOnMessageBtnClick] = useState(() => {});
 const navigate=useNavigate();
 const params=useParams();
 const examID=params.examId;
 const sectionID=params.sectionID;
 let courseId=params.courseID;   
 let qOrder=1;
 let bqOrder=1;
 const allBankQuestions=[]


  function addSelectedQuestion(question,weight){

  setSelecetdQuestions([...selecetdQuestions,{question_id:question.id,weight:weight}]);
 
 }
 function removeSelectedQuestion(question){

  setSelecetdQuestions(selecetdQuestions.filter((q) => q.question_id !== question.id));
 
 }

 async function addFromBank(){
  
  setIsLoading(true)
  const questionData={questions:selecetdQuestions}
  console.log(questionData);
   
  const response=await fetch(baseURL+"/exams/"+examID+"/sections/"+sectionID+"/add_from_bank",{
    method:'POST',
    body:JSON.stringify(questionData),
    headers:{
   
       'Content-Type': 'application/json',
       'Authorization': 'Bearer ' +getAuthToken()
    }
   
   })
   const data=await response.json();
   if(response.ok){
    console.log(data);
    setFetchQuestions(!fetchQuestions);
    setMessageType(MessageTypes.SUCCESS);
    setMessage("questions added successfully");
     setOnMessageBtnClick(() => () => setMessage(null));
   }else{

    setMessageType(MessageTypes.ERROR);
    setOnMessageBtnClick(() => () => setMessage(null));
    setMessage(data.message);

   }
    setIsLoading(false);
      
 }
 
  
 const getSectionQuestions = () => {
  setIsLoading(true);
  fetch(baseURL + "/exams/" +params.examId+'/sections/'+params.sectionID, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + getAuthToken('token'),
      },
  })
      .then((response) => {
          if (response.status === 200) {
              return response.json();
          } else {
              return Promise.reject(response);
          }
      })
      .then((data) => {
          // console.log(data.data);
          setQuestions(data.data.questions);
          setIsLoading(false);
      })
      .catch((res) => {
          console.log(res.json());
          res.json().then(data => {
              const errorMessages = data.message || "Something went wrong";
              alert(errorMessages);
          }).catch(err => {
              alert("Something went wrong");
          });
          setIsLoading(false);
      });
};
const getAllCourseQuestions = () => {
  setIsLoading(true);
  fetch(baseURL + "/question_bank?course_id=" + courseId, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + getAuthToken('token'),
      },
  })
      .then((response) => {
          if (response.status === 200) {
              return response.json();
          } else {
              return Promise.reject(response);
          }
      })
      .then((data) => {
          // console.log(data.data);
          setBankQuestoins(data.data);
          setIsLoading(false);
      })
      .catch((res) => {
          console.log(res.json());
          res.json().then(data => {
              const errorMessages = data.message || "Something went wrong";
              alert(errorMessages);
          }).catch(err => {
              alert("Something went wrong");
          });
          setIsLoading(false);
      });
};

useEffect(() => {

 getAllCourseQuestions();
 
  
 
}, [showModal]);
useEffect(() => {
  getSectionQuestions();

 }, [fetchQuestions]);

async function addQuestion(questionData,mode){
 

  setIsLoading(true)
  console.log(questionData,examID,sectionID);
 const response=await fetch(baseURL+"/exams/"+examID+"/sections/"+sectionID,{
   method:'POST',
   body:JSON.stringify(questionData),
   headers:{
  
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +getAuthToken()
   }
  
  })

  
  const data=await response.json();
  setFetchQuestions(!fetchQuestions);
  console.log(data);
  if(response.ok ){
  setShowModal(false);
  setMessageType(MessageTypes.SUCCESS);
  setMessage("question added successfully");
  setOnMessageBtnClick(() => () => setMessage(null));
  setIsLoading(false);
  }else{
    setMessageType(MessageTypes.ERROR);
    setOnMessageBtnClick(() => () => setMessage(null));
    setMessage(data.message);
  }
  }
  async function updateQuestion(questionData){
 
   setIsLoading(true)
   console.log(questionData,examID,sectionID);
   const response=await fetch(baseURL+"/exams/"+examID+"/sections/"+sectionID+"/"+questionId,{
     method:'PUT',
     body:JSON.stringify(questionData),
     headers:{
    
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +getAuthToken()
     }
    
    })
    const data=await response.json();
    if(response.ok){
      setFetchQuestions(!fetchQuestions);
      console.log(data);
      setShowEditPage(false);

      
   setMessageType(MessageTypes.SUCCESS);
   setMessage("question updated successfully");
   setOnMessageBtnClick(() => () => setMessage(null));


    }else{
      setMessageType(MessageTypes.ERROR);
      setOnMessageBtnClick(() => () => setMessage(null));
      setMessage(data.message);

    }
    setIsLoading(false);
 
   }
    
async function deleteQuestion(id){
  
  setIsLoading(true)
  const response=await fetch(baseURL+'/exams/'+examID+"/sections/"+sectionID+"/"+id,{
    method:'DELETE',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +getAuthToken()
    }
    
    });
    console.log(response);
    const data= await response.json(); 
    if(response.ok){
    setQuestions(questions.filter((question) => question.question_id !== id));
    setFetchQuestions(!fetchQuestions);
    setMessageType(MessageTypes.SUCCESS);
    setMessage("deleted question successfully");
    setOnMessageBtnClick(() => () => setMessage(null));
    
    }else{
      setMessageType(MessageTypes.ERROR);
      setOnMessageBtnClick(() => () => setMessage(null));
      setMessage(data.message);
    }
      // dont forget error handling
    setIsLoading(false);
}

function editQuestion(question){
 setEditedQuestion(question);
 setShowEditPage(true);
}
useEffect(()=>{
  console.log(editedQuestion)
},[editedQuestion])

function showQuestionForm(){
  console.log("i have been clicked");
 navigate('/newQuestion/'+params.examId);
 

}

const handleFilters = (event) => {
  setFilterValue(event.target.value);
};

const open = () => setShowModal(true);
const close = () => {setShowModal(false);
 
}
 
if(isLoading) return <Loading/>
else
return(
<div className={classes.height} > 
<div>
    
 
    <div className={classes.actions}><div name="actionDivQuestions">
  <button onClick={open}>Add a New Question</button>
  <Dialog className={classes.modal} isOpen ={showModal}>
    <div>
  <button className="close-button" name="closeBtn" onClick={close}>
    <VisuallyHidden>Close</VisuallyHidden>
    <span name="closeBtn" aria-hidden>x</span>
  </button>
  <Tabs className={classes.modalTabs} >
    <TabList className="tabsnav">
      <Tab><h1 name="tab">Add New Question</h1></Tab>
      <Tab><h1 name="tab">Add From Question Bank</h1></Tab>
    </TabList>
    <TabPanels>
      <TabPanel>
        <NewQuestionForm addQuestion={addQuestion} courseID={courseId} mode='exam'/>
      </TabPanel>
      <TabPanel>
        <h1 name="tab2">Select Multiple Questions From Question Bank:</h1>
        <div name="searchBankQuestions">   
        <form name="searchQuestions">   
        <div>     
        <input  value={bankSearchKey}  onChange={(e)=>{setBankSearchKEY(e.target.value);}} type="searchBankQuestions" placeholder="Search Questions..." required/>
        <button name="searchQuestions" type="button" onClick={()=>setBankSearchKEY("")}>
        <svg color="red" width="30" height="30" fill="currentColor" className="bi bi-search" viewBox="0 0 16 15">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
        </button>
       </div>
       <br/>
       <label name="filterLabel">
        filter by difficulty &nbsp;
       <select name="difficulty" value={filterValue} onChange={handleFilters}>
       <option value="any">Any</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
       </select>
       </label>
       </form>
      </div>
      {         bankQuestions.filter(q=>q.question_text.includes(bankSearchKey)).filter((q)=>filterValue==="any"?q.difficulty:q.difficulty===filterValue).map((question) => {
                if(!questions){

                return <SelectedQuestion 
                addSelectedQuestion={addSelectedQuestion} 
                removeSelectedQuestion={removeSelectedQuestion} 
                question={question} key={question.id} 
                questionOrder={bqOrder++}/>
                
                }
                else if(questions?.filter(element=>element.question_text===question.question_text).length===0 ){
                return <SelectedQuestion 
                addSelectedQuestion={addSelectedQuestion} 
                removeSelectedQuestion={removeSelectedQuestion} 
                question={question} key={question.id} 
                questionOrder={bqOrder++}/>
            }}
            )
            }
        <span/>
        <button onClick={()=>{  if(selecetdQuestions.length > 0){ addFromBank();setSelecetdQuestions([]);close();}}}    name="addQuestionBankBtn">Add Questions</button>
      </TabPanel>
    </TabPanels>
  </Tabs>
  </div>
  </Dialog>

  <Dialog className={classes.modal} isOpen ={showEditPage}>
    <div name="modal">
  <button className="close-button" name="closeBtn" onClick={()=>setShowEditPage(false)}>
    <VisuallyHidden>Close</VisuallyHidden>
    <span name="closeBtn" aria-hidden>x</span>
  </button>
        <NewQuestionForm onUpdate={updateQuestion}  editedQuestion={editedQuestion} mode="edit" addQuestion={addQuestion} courseID={courseId}/>
        <span/>
  </div>
  </Dialog>

  <div name="searchQuestions">   
  <form name="searchQuestions">   
    <div>        
        <input value={searchKey} onChange={(e)=>setSearchKEY(e.target.value)} type="searchQuestions" placeholder="Search Questions..." required/>
        <button name="searchQuestions" type="button" onClick={()=>setSearchKEY("")}>
        <svg color="red" width="30" height="30" fill="currentColor" className="bi bi-search" viewBox="0 0 16 15">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
        </button>
    </div>
  </form>
  </div>

  </div></div> 

  <div className={classes.search}>

</div>

{   
    
    questions ?questions.filter((question)=>question.question_text.includes(searchKey)).map(question => <Question
    question={question} mode="exam" onDelete={deleteQuestion} onEdit={editQuestion} key={question.question_id} id={question.question_id} questionOrder={qOrder++} setQuestionId={setQuestionId}
     />) : <EmptyList message="it appears exam has no questions get started by adding questions"/>
  }
    


</div>
{message && <MessageModal message={message}  type={messageType} onButtonClicked={onMessageBtnClick}/>}
</div>
 
)




}

export default ExamQuestions;