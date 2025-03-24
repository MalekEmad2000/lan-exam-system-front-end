import Card from "../ui/Card";
import classes from "./NewQuestionForm.module.css";
import styles from "./NewQuestionForm.module.css";
import { Navigate, useNavigate ,useParams} from "react-router-dom";
import {useEffect, useRef,useState} from 'react';
import ToggleSwitch from "../ui/ToggleSwitch";
import { sizeHeight } from "@mui/system";
import Viewer from 'react-viewer';

function NewQuestionForm(props) {

 const [base64code,setbase64code]=useState();

  const navigate = useNavigate();
  const params=useParams();
  const question=useRef();
  const points=useRef();
  const choiceA=useRef();
  const choiceB=useRef();
  const choiceC=useRef();
  const choiceD=useRef();
  const choiceE=useRef();
  const choiceF=useRef();
  const [isC,setIsC] = useState(false);
  const [isD,setIsD] = useState(false);
  const [isE,setIsE] = useState(false);
  const [isF,setIsF] = useState(false);
  const [isPublic,setIsPublic]=useState(true); //INVERTED
  const [inQuestionBank,setInQuestionBank]=useState(true); //INVERTED
  const [difficulty,setDifficulty]=useState('easy');
  const [count, setCount] = useState(2);
  const [selectedRadioButton , setSelectedRadioButton]=useState();

  const [activeEasy, setActiveEasy] = useState(true);
  const [activeMedium, setActiveMedium] = useState(false);
  const [activeHard, setActiveHard] = useState(false);
  
  const [ visible, setVisible ] = useState(false);

  const mode=props.mode;
  const fields=props.editedQuestion;

  const imageHandler=(e)=>{
    console.log(e);
    const files=e.target.files;
    const file=files[0];
    getbase64(file);

  }

  const getbase64=(file)=>{
   
    let reader=new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
    setbase64code(reader.result);
    };
    }


  

  const Easy = () => {
    setActiveEasy(true);
    setActiveMedium(false);
    setActiveHard(false);
  };

  const Medium = () => {
    setActiveMedium(true);
    setActiveEasy(false);
    setActiveHard(false);
  };

  const Hard = () => {
    setActiveHard(true);
    setActiveEasy(false);
    setActiveMedium(false);
  };

 

  const handleAdd =()=>{
    if(count<6)
    setCount(count+1);
    if(count>=2)
    setIsC(true);
    if(count>=3)
    setIsD(true);
    if(count>=4)
    setIsE(true);
    if(count>=5)
    setIsF(true);
  }

  const handleRemove=()=>{
    if(count>2)
    setCount(count-1);
    if(count<=3)
    setIsC(false);
    if(count<=4)
    setIsD(false);
    if(count<=5)
    setIsE(false);
    if(count<=6)
    setIsF(false);
  }

  const handleUnselectImage=()=>{
    setbase64code();
  }


  // function to get selected radio button
  function handleRadioButton(event){
 

        setSelectedRadioButton(event.target.value);
        

  }
  
  useEffect(()=>{
  
  if(mode==="edit"){
    setActiveEasy(false);
   const x=fields.choices.length-1;
    if(x>=2)
    setIsC(true);
    if(x>=3)
    setIsD(true);
    if(x>=4)
    setIsE(true);
    if(x>=5)
    setIsF(true);
    fields.diagram && setbase64code("data:image/jpeg;base64,"+fields.diagram);
    if(fields.difficulty==="easy")
    setActiveEasy(true);
    else if(fields.difficulty==="medium"){
    setActiveMedium(true);
    }
    else if(fields.difficulty==="hard")
    setActiveHard(true);

    setDifficulty(fields.difficulty)
    let i=0;
    fields.choices.map((choice)=>{
      if(choice.is_correct){
        if(i===0)
        setSelectedRadioButton("A")
       else if(i===1)
        setSelectedRadioButton("B")
        else if(i===2)
        setSelectedRadioButton("C")
        else if(i===3)
        setSelectedRadioButton("D")
        else if(i===4)
        setSelectedRadioButton("E")
        else if(i===5)
        setSelectedRadioButton("F")
      }
      i++;     
    })
  }

  }
  ,[fields])

  function createNewQuestion(event) {
 
 
  event.preventDefault();
  let choices=[];


    choices.push({choice_id:fields?.choices[0]?.choice_id,choice_text:choiceA.current.value,is_correct:(selectedRadioButton==='A'?true:false)});
    choices.push({choice_id:fields?.choices[1]?.choice_id,choice_text:choiceB.current.value,is_correct:(selectedRadioButton==='B'?true:false)});
    if(isC)
    choices.push({...(fields?.choices[2]?.choice_id && {choice_id:fields.choices[2].choice_id}),choice_text:choiceC.current.value,is_correct:(selectedRadioButton==='C'?true:false)});
    if(isD)
    choices.push({...(fields?.choices[3]?.choice_id && {choice_id:fields.choices[3].choice_id}),choice_text:choiceD.current.value,is_correct:(selectedRadioButton==='D'?true:false)});
    if(isE)
    choices.push({...(fields?.choices[4]?.choice_id && {choice_id:fields.choices[4].choice_id}),choice_text:choiceE.current.value,is_correct:(selectedRadioButton==='E'?true:false)});
    if(isF)
    choices.push({...(fields?.choices[5]?.choice_id && {choice_id:fields.choices[5].choice_id}),choice_text:choiceF.current.value,is_correct:(selectedRadioButton==='F'?true:false)});

  
   const questionData=props.mode==='exam'|| (props.mode==="edit"&& props.isBank!=true)?
   {
     question_text:question.current.value,
     weight : +points.current.value,
     difficulty : difficulty,
     is_public : isPublic,
     course_id:params.courseID,
     choices: choices,
     diagram:base64code,
    }:  {
      question_text:question.current.value,
      difficulty : difficulty,
      is_public : isPublic,
      course_id:params.courseID,
      choices: choices,
      diagram:base64code,

     }


    if(mode!=="edit")
    props.addQuestion(questionData,'single');
    else
    props.onUpdate(questionData);
    
  }

  useEffect(()=>{
    console.log(base64code);
  },[base64code])
   
  function printToggleFields(){
    console.log(isPublic,inQuestionBank);
  }
 
  return (
    <div className={classes.height}>
      <form className={classes.form} onSubmit={createNewQuestion}>
      <div className={classes.control}>
          <Card>
          <label htmlFor="Question">Enter the Question</label>
          <textarea name="questionTextarea" rows="6" resize="none" required id="Question" ref={question} defaultValue={mode==="edit"?fields.question_text:""} />
          </Card>
      </div>
      <div className={classes.answersLabel}>
      <label htmlFor="correctChoice">Answers:</label>
      </div>
  
        <div className={classes.control}>
        <Card>
          <label htmlFor="title">(A)</label>
          <textarea name="questionTextarea" rows="3" required id="ChoiceA" ref={choiceA}  defaultValue={mode==="edit"?fields?.choices[0]?.choice_text:""}/>
          </Card>
        </div>
        <div className={classes.control}>
        <Card>
          <label htmlFor="title">(B)</label>
          <textarea name="questionTextarea" rows="3" required id="ChoiceB" ref={choiceB} defaultValue={mode==="edit"?fields?.choices[1]?.choice_text:""}/>
          </Card>
        </div>
        <div>
        { isC && <div className={classes.control}>
        <Card>
          <label htmlFor="title">(C)</label>
          <textarea name="questionTextarea" rows="3" required id="ChoiceC" ref={choiceC} defaultValue={mode==="edit"?fields?.choices[2]?.choice_text:""}/>
          </Card>
        </div>}
        </div>
        {isD && <div className={classes.control}>
        <Card>
          <label htmlFor="title">(D)</label>
          <textarea name="questionTextarea" rows="3" required id="ChoiceD"   ref={choiceD} defaultValue={mode==="edit"?fields?.choices[3]?.choice_text:""} />
          </Card>
        </div>}
        {isE && <div className={classes.control}>
        <Card>
          <label htmlFor="title">(E)</label>
          <textarea name="questionTextarea" rows="3" required id="ChoiceE"   ref={choiceE} defaultValue={mode==="edit"?fields?.choices[4]?.choice_text:""}/>
          </Card>
        </div>}
        {isF && <div className={classes.control}>
        <Card>
          <label htmlFor="title">(F)</label>
          <textarea name="questionTextarea" rows="3" required id="ChoiceF"   ref={choiceF} defaultValue={mode==="edit"?fields?.choices[5]?.choice_text:""}/>
          </Card>
        </div>}
        <div className={classes.addRemBtns}>
        <button id={styles.addBtn} type="button" onClick={handleAdd}>Add</button>
        <button id={styles.removeBtn} type="button" onClick={handleRemove}>Remove</button>
        </div>
        <div className={classes.control_right}>
          <div  className={classes.answersLabel}>
            <label htmlFor="correctChoice">Correct Answer:</label>
          </div>
          <div  className={classes.correct_choices_control}>
            <div className={classes.correctLables}>
              <label htmlFor="correctA">(A)</label>
            </div>
            <input  value="A" type="radio" name="correct_choice" required id="correctA" onClick={handleRadioButton} defaultChecked={mode==="edit"&&fields?.choices[0]?.is_correct ? true:false   } />
          </div>
          <div className={classes.correct_choices_control}>
            <div className={classes.correctLables}>
              <label htmlFor="title">(B)</label>
            </div>
            <input type="radio" value="B" name="correct_choice" required id="CorrectB" onClick={handleRadioButton} defaultChecked={mode==="edit"&&fields?.choices[1]?.is_correct ? true:false   } />
          </div>
          {isC && <div className={classes.correct_choices_control}>
            <div className={classes.correctLables}>
              <label htmlFor="title">(C)</label>
            </div>
            <input type="radio" value="C" name="correct_choice" required id="CorrectC" onClick={handleRadioButton} defaultChecked={mode==="edit"&&fields?.choices[2]?.is_correct ? true:false   } />
          </div>}
          {isD && <div className={classes.correct_choices_control}>
            <div className={classes.correctLables}>
              <label htmlFor="title">(D)</label>
            </div>
            <input type="radio" value="D" name="correct_choice" required id="CorrectD"  onClick={handleRadioButton} defaultChecked={mode==="edit"&&fields?.choices[3]?.is_correct ? true:false   }/>
          </div>}
          {isE && <div className={classes.correct_choices_control}>
            <div className={classes.correctLables}>
              <label htmlFor="title">(E)</label>
            </div>
            <input type="radio" value="E" name="correct_choice" required id="CorrectE"  onClick={handleRadioButton} defaultChecked={mode==="edit"&&fields?.choices[4]?.is_correct ? true:false   }/>
          </div>}
          {isF && <div className={classes.correct_choices_control}>
            <div className={classes.correctLables}>
              <label htmlFor="title">(F)</label>
            </div>
            <input type="radio" value="F" name="correct_choice" required id="CorrectF"  onClick={handleRadioButton} defaultChecked={mode==="edit"&&fields?.choices[5]?.is_correct ? true:false   }/>
          </div>}
          {(props.mode==='exam' || (props.mode==='edit' && props.isBank!=true) ) &&
           <div className={classes.control_points}>
          <div className={classes.answersLabel}>
              <label htmlFor="quantity">Points:</label>
            </div>
          <input className={classes.quantityBox} type="number" id="quantity" name="quantity" min="1" max="100" ref={points} defaultValue={mode=="edit"?fields.weight:1}></input>
          </div> }
        </div>
        <div name="difficulty">
          <label className={classes.answersLabel}>Difficulty:</label>
          <div className={classes.addRemBtns}>
          <button type="button" onClick={()=>{setDifficulty('easy'); Easy();}} style={{ backgroundColor: activeEasy ? "rgb(5, 202, 54)" : "grey" }} id={styles.easyBtn}>Easy</button>
          <button type="button" onClick={()=>{setDifficulty('medium'); Medium();}} style={{ backgroundColor: activeMedium ? "#f9a323" : "grey" }} id={styles.mediumBtn}>Medium</button>
          <button type="button" onClick={()=>{setDifficulty('hard'); Hard();}} style={{ backgroundColor: activeHard ? "#eb2632" : "grey" }} id={styles.hardBtn}>Hard</button>
          </div>
        </div><br/>
        <div>
        <button className="close-button" type="button" name="closeBtn" onClick={handleUnselectImage}>
        <span className={classes.closeButton} aria-hidden>x</span>
        </button>
        <label className={classes.answersLabel}><br/>Upload Image: [optional]<br/></label>
        <input className={classes.imageUploader} accept="image/*" type="file" id="select-image" onChange={imageHandler}/>
        <div>
        <img className={classes.uploadedImage} src={base64code} onClick={() => { setVisible(true); } }></img>
        <Viewer
        visible={visible}
        onClose={() => { setVisible(false); } }
        images={[{src: base64code}]}
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
        </div>
        <div name="privacy">
          <label className={classes.toggleLabelPrivacy}>Privacy:</label>
          <label name="privacy">Private</label>
          <ToggleSwitch checked={isPublic} setChecked={setIsPublic}/>
          <label name="privacy">Public</label>
          </div>
          <br/>
          {/* props.mode==='exam' &&
          <div name="questionBank">
          <label className={classes.toggleLabelQuestionBank}>Add to Question Bank:</label>
          <label name="questionBank">No</label>
          <ToggleSwitch checked={inQuestionBank} setChecked={setInQuestionBank}/>
          <label name="questionBank">Yes</label>
          </div>
          */}
        <div className={classes.actions}>
          <button id={styles.submitBtn}>{mode==="edit"?"update":"Create Question"}</button>
        </div>
      </form>
    </div>

  );
}

export default NewQuestionForm;
