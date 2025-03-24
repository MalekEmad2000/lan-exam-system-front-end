import { AiFillPropertySafety } from "react-icons/ai";
import { baseURL ,getAuthToken} from "../components/store/Authentication";
import NewQuestionForm from "../components/questions/NewQuestionForm";
import {json, useParams}   from 'react-router-dom'



function NewQuestion(){


const params=useParams();
const examID=params.examID;
const sectionID=params.sectionID;

// insert question from database  question data is a an object with requiered fields exam id is given below
async function addQuestion(questionData){
 

console.log(questionData);
const response=await fetch(baseURL+"/exams/"+examID+"sections/"+sectionID,{
 method:'Post',
 body:JSON.stringify(questionData),
 Headers:{

    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' +getAuthToken()
 }

})

const data=await response.json();
console.log(data);

}



return(


<div> 

<NewQuestionForm addQuestion={addQuestion} />



</div>

)






}


export default NewQuestion;