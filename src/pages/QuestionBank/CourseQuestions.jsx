import {React,useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { baseURL, getAuthToken } from "../../components/store/Authentication";
import Question from "../../components/questions/Question";
import styles from "./QuestionBank.module.css";
import Loading from "../../components/Loading/Loading";
import * as FaIcons from 'react-icons/fa';
import {  EmptyList } from "../../components/EmptyList/EmptyList";
import { Dialog } from '@reach/dialog';
import {VisuallyHidden} from '@reach/visually-hidden';
import NewQuestionForm from "../../components/questions/NewQuestionForm";
import MessageModal ,{ MessageTypes }  from "../../components/Message/Message"; 



export default function CourseQuestions() {
    const params = useParams(); 
    const courseID=params.courseID;
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate =useNavigate();
    const [showEditPage,setShowEditPage] = useState(false);
    const [editedQuestion,setEditedQuestion]=useState();
    const [questionId,setQuestionId]=useState();
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(MessageTypes.ERROR);
    const [onMessageBtnClick, setOnMessageBtnClick] = useState(() => {});
    const [refetch,setRefetch]=useState(false)
    let qOrder = 1;
    const getAllCourseQuestions = () => {
        setIsLoading(true);
        fetch(baseURL + "/question_bank?course_id=" + courseID, {
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
                setQuestions(data.data);
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
    function editQuestion(question){
        setEditedQuestion(question);
        setShowEditPage(true);
       }

       async function updateQuestion(questionData){
 
       
        setIsLoading(true);
        const response=await fetch(baseURL+"/question_bank/"+questionId,{
          method:'PUT',
          body:JSON.stringify(questionData),
          headers:{
         
             'Content-Type': 'application/json',
             'Authorization': 'Bearer ' +getAuthToken()
          }
         
         })
       
         
         const data=await response.json();
        if(response.ok){
         console.log(data);
         setShowEditPage(false);
         setRefetch(!refetch);
         setMessageType(MessageTypes.SUCCESS);
         setMessage("updated bank question successfully");
         setOnMessageBtnClick(() => () => setMessage(null));
        }else{

            setMessageType(MessageTypes.ERROR);
            setOnMessageBtnClick(() => () => setMessage(null));
            setMessage(data.message);

        }
         setIsLoading(false);
        
         
      
        }
    
    async function deleteQuestion(id){

        const response=await fetch(baseURL+'/question_bank/'+id,{
            method:'DELETE',
            headers:{
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' +getAuthToken()
            }
            
            });
            const data= await response.json();  
            console.log(response)
            if(response.ok){
            setQuestions(questions.filter((question) => question.id !== id));
            setMessageType(MessageTypes.SUCCESS);
            setMessage("deleted question successfully");
            setOnMessageBtnClick(() => () => setMessage(null));
            }else{
                setMessageType(MessageTypes.ERROR);
                setOnMessageBtnClick(() => () => setMessage(null));
                setMessage(data.message);
            }
             // dont forget error handling
              console.log(data)
    }

    useEffect(() => {
        getAllCourseQuestions();
        console.log(editedQuestion);
    }, [refetch]);

    if(isLoading)
         return <Loading/>;

  return (
    <div className={styles.container}>
      <h1>Question Bank For Course {courseID}</h1>
      <p className={styles.hint}>You can only see questions that you have created or that are publicly available.</p>
      <button onClick={()=>{
        navigate('/questionbank/'+courseID+'/addquestion')
      }} className={styles.addQuestionBtn}>
                        <FaIcons.FaUserPlus />

                        <span className={styles.addIcon}>Add New Question</span>

                    </button>
        {questions.length === 0 &&
            (
                <EmptyList/>
            )}

        { 
            questions.map((question) => {
                return <Question question={question} key={question.id} id={question.id} onEdit={editQuestion} questionOrder={qOrder++} onDelete={deleteQuestion}   mode="questionBank" setQuestionId={setQuestionId}/>
            }
            )
        }
            
     <Dialog className={styles.modal} isOpen ={showEditPage}>
       <div name="modal">
        <button className="close-button" name="closeBtn" onClick={()=>setShowEditPage(false)}>
        <VisuallyHidden>Close</VisuallyHidden>
            <span name="closeBtn" aria-hidden>x</span>
          </button>
        <NewQuestionForm onUpdate={updateQuestion}  editedQuestion={editedQuestion} mode="edit" isBank={true}/>
        <span/>
        </div>
      </Dialog>
    

      {message && <MessageModal message={message}  type={messageType} onButtonClicked={onMessageBtnClick}/>}
    </div>
  );
}