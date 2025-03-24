import {Navigate, useNavigate,useParams}  from "react-router-dom"
import {useEffect,useState} from 'react'
import classes from "./Section.module.css"

function Section(props){
    
    const navigate=useNavigate();
    const params=useParams();
    const examID=params.examID;
    const courseID=params.courseID;

    function deleteSection(){
        props.onDelete(props.id);
    }
    
    // add new question to section 
    function examQuestions(){
    
  
    navigate('/ExamQuestions/'+examID+"/section/"+props.id+'/'+courseID);
 
    }

    function edit(){ 

        props.setShowForm(true);
        props.setMode("edit");
        props.setShuffle(props.shuffled);
        props.setSectionName(props.title);
        props.setSelectedQuestion({id:props.id,title:props.title,shuffle:props.shuffle})
        
    }
    
    return (
    <div className={classes.card}>
    <div className={classes.cardHeader} onClick={examQuestions}><h3> {props.title} </h3><p>Questions Count: {props.questionsCount}</p><p>shuffle:{props.shuffled?"yes":" no"}</p></div>
    <button onClick={edit} name="renameBtn"><svg width="25" height="25" fill="none" viewBox="0 -2 15 22" stroke="currentColor" strokeWidth="2">
    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg></button>

    <button name="deleteBtn" onClick={deleteSection}><svg width="25" height="25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg></button>
    
    </div>
    )

}

export default Section;
