import { React, useEffect, useState } from "react";
import styles from "./QuestionBank.module.css";
import * as FaIcons from 'react-icons/fa';
import { baseURL, getAuthToken } from "../../components/store/Authentication";
import Loading from "../../components/Loading/Loading";
import { EmptyList } from "../../components/EmptyList/EmptyList";

function CoursesQuestionBank() {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const getAllCourses = () => {
        setIsLoading(true);
        fetch(baseURL + "/courses?show_questions_count=true", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getAuthToken()
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
                setQuestions(data.data);
                setIsLoading(false);
            })
            .catch((res) => {
                console.log(res.json());
                res.json().then(data => {
                    const errorMessages = data.message || "Something went wrong";
                    alert(errorMessages);
                }).catch(err => {
                    console.log(err);
                    alert("Something went wrong");
                });
                setIsLoading(false);
            });
    };

    useEffect(() => {
        getAllCourses();
    }, []);

    if(isLoading)
    return <Loading/>;

    return (
        <div className={styles.container}>
            <h1>Question Bank By Courses</h1>
            <p className={styles.hint}>Choose a course to see its questions</p>
            {questions.length === 0 && 
            (
                <EmptyList message ="No courses found. Please add a course first."  />
               
            )}


            
            <div className={styles.grid}>
           { 
                questions.map((question) => {
                    return (
                        <div className={styles.course_card} key={question.course_id}>
                       <a href={`/questionBank/${question.course_id}`} >
                            
                                <h3><FaIcons.FaBook className={styles.book_icon} /> Course Id : {question.course_id}</h3>
                                <h3>Name of the course : {question.course_name}</h3>
                                <h4>Number of Questions : {question.questions_count}</h4>
                                <FaIcons.FaArrowRight className={styles.arrow} />
                        </a>
                        </div>
                      
                    )
                })
            }
                
                </div>
 
        </div>
        
    );
}

export default CoursesQuestionBank;