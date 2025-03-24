import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import styles from "./Students.module.css";
import { FaDownload,FaPaperPlane } from "react-icons/fa";
import studentsTemplateFile from "../../assets/Files/students_template.xlsx";
import { baseURL } from "../store/Authentication";
import { requestHeader } from "../constants";
import Loading from "../Loading/Loading";
import YesNoModal from "../Modal/YesNoModal";
import MessageModal, { MessageTypes } from "../Message/Message";

function Students(props) {
  const navigate = useNavigate();
  const [students, setStudents] = useState(props.data);
  const [isLoading,setIsLoading] = useState(false);
  const [isInserted,setIsInserted] = useState(false);
  // const [perPage, setPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [messageType ,setMessageType]=useState(MessageTypes.ERROR);
  const [message ,setMessage]=useState(null);
  
  const {exam_id} = useParams();
  const getStudents=async()=>{
    const response=await fetch(baseURL + "/exams/" + exam_id + "/students", {
        method: "GET",
        headers: requestHeader
      });
      const resData = await response.json();
      if (response.status < 400) {
        setStudents(resData.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        const errorMessage = resData.message || "Error getting students";
        setMessageType(MessageTypes.ERROR);
        setMessage(errorMessage);
        // alert(errorMessage);
      }
      setIsLoading(false);
}

const insertStudents = async () => {
  if(students.length === 0){
    setMessageType(MessageTypes.ERROR);
    setMessage("No students to insert");
    return;
  }
  const res = await fetch(baseURL+"/exams/"+exam_id+"/students",{
    method: "POST",
    headers: requestHeader,
    body: JSON.stringify(students)
  });
  const resData = await res.json();
  if(res.ok){
    getStudents();
    setMessageType(MessageTypes.SUCCESS);
    setMessage("Students inserted successfully");
    // alert("Students inserted successfully");
  }else{
    const errorMessage = resData.message || "Error inserting students";
    setMessageType(MessageTypes.ERROR);
    setMessage(errorMessage);
    // alert(errorMessage);
  }

};
const deleteStudent = async (id) => {
  try{
  setIsLoading(true);
  const res = await fetch(baseURL+"/exams/"+exam_id+"/students/"+id,{
    method: "DELETE",
    headers: requestHeader
  });
  const resData = await res.json();
  if(res.status < 400){
    getStudents();
    setMessageType(MessageTypes.SUCCESS);
    setMessage("Student deleted successfully");
    // alert("Student deleted successfully");
    
  }else{
    const errorMessage = resData.message || "Error deleting student";
    setMessage(errorMessage);
  
    // alert(errorMessage);}
  }
  }catch(err){
    setMessageType(MessageTypes.ERROR);
    setMessage("Error deleting student");
    // alert("Error deleting student");

  }
  setIsLoading(false);
  setIsModalOpen(false);

  };


  const columns = [
    {
        name : "ID*",
        selector: (row) => row.id
    },
    {
        name : "Name*",
        selector: (row) => row.name
    },
    {
      name : "National ID",
      selector: (row) => row.national_id?? "N/A"
  },
  {
    name : "Email",
    selector: (row) => row.email?? "N/A"
},
{
  name : "Remaining Attempts",
  selector: (row) => row.remaining_attempts?? "N/A"
},
{
  name : "Status",
  selector: (row) => row.status
},
{
  name : "Actions",
  selector: (row) => <div className={styles.actions}>
    
    <button className={styles.deleteBtn} onClick={()=>{
    setIsModalOpen(true);
    setSelectedStudentId(row.id);
  }}>Delete</button>


  </div>
}
  ];


  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

      
        fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, {type: 'buffer'});
        
        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);
        
        resolve(data);
      };

      fileReader.onerror = (error) => {
        setMessageType(MessageTypes.ERROR);
        setMessage("Error reading file");
        // alert("Error reading file");
        reject(error);
      };
    });

    promise.then((d) => {
        setStudents(d.filter((a)=>a.name.trim().length!=0 && String(a.id).trim().length!=0));
        //setStudents(d);
    });
  };

  useEffect(()=>{
    getStudents();
},[]);

if(isLoading){
  return <Loading/>;
}
  return (
    <>
    {message &&
     <MessageModal message={message} onButtonClicked={()=>{setMessage(null)}} type={messageType}
     />
    }
    <div className={styles.container}>
      {/* Delete Student Modal Warning */}
      {isModalOpen && <YesNoModal 
      title="Delete Student"
       message="Are you sure you want to delete this student?
        Deleting a student will delete all his/her exam answers and results."
       onYes={()=>{deleteStudent(selectedStudentId)}} 
       onNo={()=>{setIsModalOpen(false)}}
       onCancel={()=>{setIsModalOpen(false)}}
       />}
       
      <a className={styles.btn} href={studentsTemplateFile} download={'students_template.xlsx'} ><FaDownload className={styles.btnIcon}/>  Download Template File  </a> 

      <input className={styles.chooseFile}
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
          setIsInserted(true);
        }}
      />
      <br/>
      <p className={styles.notep}>*Note: Upload only new students, Duplicates are not allowed.</p>
      {
        isInserted &&
      <button className={styles.btn} onClick={() =>insertStudents()}> <FaPaperPlane className={styles.btnIcon} />  Insert Students</button> 
      }
      <div className="studentsTable">
        <DataTable
        title = {"Students ("+(students? students.length : 0 )+")"}
        columns={columns}
        data = {students}
       // progressPending = {loading}
        paginationRowsPerPageOptions = {[5,10,15,20]}
        paginationPerPage = {10}
        pagination
        />
    </div>
    </div>
    </>
  );
}

export default Students;
