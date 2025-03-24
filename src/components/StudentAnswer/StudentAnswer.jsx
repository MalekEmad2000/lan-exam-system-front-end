import styles from "./StudentAnswer.module.css";
import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { baseURL } from "../store/Authentication";
import { requestHeader } from "../constants";
import Loading from "../Loading/Loading";
import Question from "../questions/Question";
import MessageModal, { MessageTypes } from "../Message/Message";
import { useNavigate } from "react-router-dom";
import { EmptyList } from "../EmptyList/EmptyList";



export function StudentAnswer(props) {
    const { exam_id, student_id } = useParams();
    const [studentAnswer, setStudentAnswer] = useState({});
    const [exam, setExam] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error , setError] = useState(null);
    const navigate = useNavigate();
    let qOrder=1;
 
    const getStudentAnswer = async () => {

        setIsLoading(true)
        const response = await fetch(baseURL + "/exams/" + exam_id + "/students/" + student_id+"/answers", {
            method: "GET",
            headers: requestHeader
        });
        const resData = await response.json();
        if (response.status < 400) {
            setStudentAnswer(resData.data);
            setIsLoading(false)
           
        } else {
            
            const errorMessage = resData.message || "Error getting students";
            setError(errorMessage);
            // alert(errorMessage);
        }
      
    }
    useEffect(()=>{

        getStudentAnswer()
   
       },[])
   

    if (isLoading || !exam)
        return <Loading />;
    return <>
    {error && <MessageModal message={error} type={MessageTypes.ERROR} onButtonClicked={() =>{
        setError(null);
        navigate(-1);
        }} />}
        <div className={styles.container}>
            <h1>Student Answer </h1>
            <h2>Student name: {studentAnswer.name} </h2>
            <h2>Student ID: {studentAnswer.student_id} </h2>
            <h2>Score = {studentAnswer.score + " / " + studentAnswer.total_exam_score}</h2>
            <h2>Number of solved questions: {studentAnswer.number_of_solved_questions} / {studentAnswer.total_questions}</h2>
            <p>*Note : Green : Correct answer , Red : Wrong answer , Yellow : Student answer</p>
            {   
    
   studentAnswer?.student_answers?.map(question => <Question
    question={question}    key={qOrder} id={qOrder} questionOrder={qOrder++}
     />) 
  }

        </div>
    </>
}