import { getUserID } from "../store/Authentication";
import classes from "./Question.module.css"
import * as FaIcons from 'react-icons/fa';
import {useEffect, useState} from 'react';
import Viewer from 'react-viewer';

function Question(props) {
  const question = props.question;
  const questionOrder = props.questionOrder;
  const onEdit = props.onEdit;
  const Delete = props.onDelete;
  let choiceIndex = -1;
  // console.log(question.professor_id === getUserID());
    // console.log(getUserID());

  const [hasImage,setHasImage]=useState(true);
  const [ visible, setVisible ] = useState(false);

  function deleteQuestion(){

  props.onDelete(props.id);

  }
  function editQuestion(){

  props.setQuestionId(props.id);
  props.onEdit(props.question);
  
  }
  
// console.log(question);

  return (
    <div className={classes.card}>
      <div className={classes.item}>
        <div className={classes.content}>
        {question.diagram &&
        <div>
        <img className={classes.modal_image} src={"data:image/jpeg;base64,"+question.diagram} onClick={() => { setVisible(true); } }></img>
        <Viewer
        visible={visible}
        onClose={() => { setVisible(false); } }
        images={[{src: "data:image/jpeg;base64,"+question.diagram}]}
        changeable={false}
        rotatable={false}
        scalable={false}
        showTotal={false}
        noImgDetails={true}
        loop={false}
        minScale={0.25}
        zoomSpeed={0.25}
        onMaskClick={() => { setVisible(false); }}
        />
      </div>
          }
          <h3>{questionOrder}. {question.question_text} <span></span></h3>
          {
            question.choices.map((choice) => {
              // console.log("dsdsdsdsdsdsdsd");
              choiceIndex++;
              return <p key={choiceIndex} 
              className={               
               ` ${choice.is_student_choice ? classes.studentAnswer : " "} 
                ${choice.is_correct ? classes.correct : classes.incorrect} `
              }
              >{String.fromCharCode(65 +choiceIndex )+'. '+ choice.choice_text}</p>
            })
          }
          {
            props.mode==="questionBank" &&
            <div><h4 className={classes.h4}>Difficulty: </h4><h4 className={question.difficulty==="easy" ? classes.h4Easy : question.difficulty==="medium" ? classes.h4Medium : classes.h4Hard}>{question.difficulty}</h4></div>
          }
          {
            props.mode==="exam" &&
            <div><h4 className={classes.h4}>Difficulty: </h4><h4 className={question.difficulty==="easy" ? classes.h4Easy : question.difficulty==="medium" ? classes.h4Medium : classes.h4Hard}>{question.difficulty}</h4><h4 className={classes.h4}> Points: {question.weight}</h4></div>
          }
          
          {/* <button className={classes.addToExam} > <FaIcons.FaPlus /> Add To Exam</button> */}
          {props.mode==="questionBank" && question.professor_id === parseInt(getUserID()) &&(
            <>
          <button className={classes.edit}>
          <span onClick={editQuestion}>EDIT QUESTION</span>
          <svg width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
          <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
          </svg>
          </button>
          <button   className={classes.del}>
          <span onClick={deleteQuestion}>CONFIRM DELETE</span>
          <svg width="25" height="25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          </button>
          </>
          )}
          {props.mode==="exam" && (
            <>
          <button className={classes.edit}>
          <span onClick={editQuestion}>EDIT QUESTION</span>
          <svg width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
          <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
          </svg>
          </button>
          <button   className={classes.del}>
          <span onClick={deleteQuestion}>CONFIRM DELETE</span>
          <svg width="25" height="25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          </button>
          </>
          )}
          

        </div>
      </div>
    </div>
  );
}

export default Question;
