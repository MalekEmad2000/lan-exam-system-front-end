import {Navigate, useNavigate,useParams}  from "react-router-dom"
import {useEffect,useState} from 'react'
import "./Sections.module.css"
import { baseURL,getAuthToken } from "../store/Authentication"
import Section from "./Section"
import ToggleSwitch from "../ui/ToggleSwitch"
import SectionForm from "./SectionForm"
import shadows from "@mui/material/styles/shadows"
 

function Sections(props){


const  params=useParams();
const[isLoading,setIsLoading]=useState(false);
const [sections,setSections]=useState([]);
const [sectionName,setSectionName]=useState();
const [shuffle,setShuffle]=useState(false);
const [refetch,setRefetch]=useState(false);
const [showForm,setShowForm]=useState(false);
const [mode,setMode]=useState("create");
const [selectedQuestion,setSelectedQuestion]=useState({});


 function debug(){

  console.log(shuffle)
 }
useEffect(()=>{console.log(shuffle)},[shuffle])
async function addSection(){

 
  console.log("Adding sections"+shuffle);

  const response=await fetch(baseURL+'/exams/'+params.examID+'/sections',{
    method:'POST',
    body:JSON.stringify({

      section_title : sectionName,
      random_shuffle:shuffle
    }),
    headers:{
  
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +getAuthToken()
  
    }
   })
   const data=await response.json();
    console.log(data)
    setRefetch(!refetch);

}
async function updateSection(id){

 
  console.log(selectedQuestion);


  const response=await fetch(baseURL+'/exams/'+params.examID+'/sections/'+selectedQuestion.id,{
    method:'PUT',
    body:JSON.stringify({

      section_title : sectionName,
      random_shuffle:shuffle
    }),
    headers:{
  
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +getAuthToken()
  
    }
   })
   const data=await response.json();
    console.log(data)
    setRefetch(!refetch);

}


async function fetchSections(){
  
setIsLoading(true)
 const response=await fetch(baseURL+'/exams/'+params.examID+'/sections',{
  method:'GET',
  headers:{

    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' +getAuthToken()

  }
 })
 const data=await response.json();
   setSections(data.data);
   setIsLoading(false);
   
}
async function deleteSection(sectionID){
 console.log("deleting",sectionID,params.examID);
  const response=await fetch(baseURL+'/exams/'+params.examID+'/sections/'+sectionID,{
    method:'DELETE',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +getAuthToken()
    }

    });
    console.log(response)
    if(response.ok){
    setSections(sections.filter((section) => section.section_id !== sectionID));
    }
    const data= await response.json();  // dont forget error handling
      console.log(data)



}
function editSection(sectionName,shuffle){

setMode("edit");
console.log(sectionName,shuffle);

}

useEffect(()=>{fetchSections(); },[refetch]);

  return(
    <div>
     <SectionForm  selectedQuestion={selectedQuestion}  mode={mode} showDialog={showForm} setShowDialog={setShowForm} updateSection={updateSection} addSection={addSection} setSectionName={setSectionName}
      setShuffle={setShuffle}  shuffle={shuffle}/>
     <button name="addSection"  type="button" onClick={()=>{setShowForm(true);setMode("create")}}>Add New Section</button>
   

 {sections.map(section=><Section
  key={section.section_id}
  id={section.section_id}
  onDelete={deleteSection}
  title={section.section_title}
  onEdit={editSection}
  questionsCount={section.questions_count}
  setShowForm={setShowForm}
  setMode={setMode}
  setSectionName={setSectionName}
  shuffled={section.random_shuffle}
  setShuffle={setShuffle}
  setSelectedQuestion={setSelectedQuestion}
 
 />)}

    <span/>
  
    </div>
  )

}

export default Sections;
