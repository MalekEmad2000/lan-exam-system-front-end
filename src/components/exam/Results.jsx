import  {useNavigate, useParams}    from "react-router-dom"
import  {useState,useEffect} from "react"
import DataTable from "react-data-table-component";
import { Row,Col,Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import Loading from "../Loading/Loading";
import styles from "./Results.module.css";
import { FaFileExport } from "react-icons/fa";

function Results(props){
    const navigate=useNavigate();
    const [data,setData] = useState(props.data);
    const [isLoading,setIsLoading] = useState(false);
    const [perPage,setPerPage] = useState(10);
    const grades = props.grades;

    // const {exam_id}= useParams();
   
 
    const columns = [
        {
            name : "ID",
            selector: (row) => row.student_id
        },
        {
            name : "Name",
            selector: (row) => row.name
        },
        {
            name : "Number of solved questions",
            selector: (row) => row.number_of_solved_questions + "/" + row.total_questions
        },
        {
            name : "Score",
            selector: (row) => row.score + "/" + row.total_exam_score
        },
        {
  name : "Actions",
  selector: (row) => <div className={styles.actions}>
    <button className={styles.viewAnswerBtn} onClick={()=>{
    navigate('StudentAnswer/'+row.student_id)
  }}>Answer</button>
   


  </div>
}
    ];

    const ExportHandler = () =>
    {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(grades);
        XLSX.utils.book_append_sheet(wb,ws,"Sheet1");
        XLSX.writeFile(wb,"Results.xlsx");
    }
    
    if(isLoading)
    {
        return <Loading/>;
    }

    return(
    <div className={styles.resultsTable}>
        <Button className={styles.exportBtn} onClick={ExportHandler}> <FaFileExport className={styles.exportBtnIcon}/> Export</Button>
        <DataTable
        title = "Results"
        columns={columns}
        data = {grades}
        progressPending = {isLoading}
        paginationRowsPerPageOptions = {[5,10,15,20]}
        paginationPerPage = {10}
        pagination
        />
    </div>)
}

export default Results;