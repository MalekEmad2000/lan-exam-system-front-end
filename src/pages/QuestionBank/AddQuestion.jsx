import React from "react";
import styles from "./AddQuestion.module.css";
import { useParams } from "react-router-dom";
import NewQuestionForm from "../../components/questions/NewQuestionForm";
import { baseURL } from "../../components/store/Authentication";
import { requestHeader } from "../../components/constants";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MessageModal, { MessageTypes } from "../../components/Message/Message";

export default function AddQuestionToBank() {
    const { courseID } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [messageType , setMessageType] = useState(null);
    const [onMessageBtnClick, setOnMessageBtnClick] = useState(() => {});
    

    async function addQuestion(question) {
        try{
        const response = await fetch(baseURL+'/question_bank', {
            method: "POST",
            body: JSON.stringify(question),
            headers: requestHeader
        });
        const data = await response.json();
        if(response.status=== 200 || response.status===201){
            // alert("Question added successfully");
            setMessageType(MessageTypes.SUCCESS);
            setOnMessageBtnClick(() => () => navigate(`/questionbank/${courseID}`));
            setMessage("Question added successfully");
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
  return (
  <>
    {message && <MessageModal message={message} type={messageType} onButtonClicked={onMessageBtnClick}/>}
  <div className={styles.container}>
    <h2>Add New Question to bank In Course {courseID}</h2>
    <NewQuestionForm mode='bank' addQuestion={addQuestion}/>
  </div>
  </>
    );


}