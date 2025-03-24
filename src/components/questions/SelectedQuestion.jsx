import {Navigate, useNavigate,useParams}  from "react-router-dom"
import {useEffect,useState} from 'react'
import classes from "./SelectedQuestion.module.css"
import {motion, spring} from 'framer-motion'
import Viewer from 'react-viewer';

function SelectedQuestion(props){
    
    const question=props.question;
    const[points,setPoints]=useState(1);
    const [isOpen,setIsOpen] = useState(false);
    let choiceIndex = -1;
     
    const [ visible, setVisible ] = useState(false);

    function handleCheckbox(event){


          if(event.target.checked===true)
          props.addSelectedQuestion(question,+points);
          else
          props.removeSelectedQuestion(question)
          console.log(question.diagram);

    }
    
    return (
    <div><input name="checkbox" type="checkbox" onChange={handleCheckbox}/>
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
        drag={false}
        />
      </div>
          }
    <motion.div 
    transition={{layout : {duration:1 , type:"spring",bounce:0.4}}} 
    layout 
    className={classes.card} 
    onClick = {() => setIsOpen(!isOpen)}
    style = {{borderRadius: '20px'}}>
      
    <motion.div className={classes.cardHeader}>{question.diagram?<motion.h3 layout="position">{question.question_text}</motion.h3>:<motion.h3 className={classes.noImage} layout="position">{question.question_text}</motion.h3>}</motion.div>
    <motion.div layout="position" name="points">
    <h1 name="points">Points: </h1>
    <input className={classes.quantityBox} placeholder="1" type="number" id="quantity" name="quantity" min="1" max="100"  onChange={e=>setPoints(e.target.value)} ></input>
    {question.difficulty==="easy"&&<h3 name="difficultyEasy">Easy</h3>}
    {question.difficulty==="medium"&&<h3 name="difficultyMed">Medium</h3>}
    {question.difficulty==="hard"&&<h3 name="difficultyHard">Hard</h3>}
    </motion.div>
    {isOpen &&
    <motion.div className={classes.answers}>
        {
            question.choices.map((choice) => {
              // console.log("dsdsdsdsdsdsdsd");
              // console.log(question);
              choiceIndex++;
              return <p key={choiceIndex} 
              className={               
               ` ${question?.student_answer?.student_choice === choice.choice_id ? classes.studentAnswer : " "} 
                ${choice.is_correct ? classes.correct : classes.incorrect} `
              }
              >{String.fromCharCode(65 +choiceIndex )+'. '+ choice.choice_text}</p>
            })
          }
    </motion.div>}
    </motion.div>
        
    </div>
    ) 

}

export default SelectedQuestion;
