import NewExamForm from "../components/exam/NewExamForm";
import {useNavigate} from "react-router-dom"
import { getAuthToken,baseURL } from "../components/store/Authentication";
import { useState } from "react";
import MessageModal, { MessageTypes } from "../components/Message/Message";



function NewExam(){

    const navigate=useNavigate();
    const [message, setMessage] = useState(null);
    const [messageType , setMessageType] = useState(null);
    const [onMessageBtnClick, setOnMessageBtnClick] = useState(() => {});
    async function addExam(examData){

// adding exam into database 
        try{
        const res = await fetch(
            baseURL+"/exams",
            {
            method: 'POST',
            body: JSON.stringify(examData),
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' +getAuthToken()
            } 
            });
            const data = await res.json();
            if(res.status=== 200 || res.status===201){
                // alert("Question added successfully");
                setMessageType(MessageTypes.SUCCESS);
                setMessage("Exam added successfully");
                setOnMessageBtnClick( () => () => navigate('/home'));
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






return(
<div>
{message && <MessageModal message={message}  type={messageType} onButtonClicked={onMessageBtnClick}/>}
<NewExamForm createExam={addExam}/>
</div>
)







}


export default NewExam;