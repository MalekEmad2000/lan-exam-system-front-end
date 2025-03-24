import DataTable from "react-data-table-component";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../Loading/Loading";
import * as XLSX from "xlsx";
import { FaFileExport } from "react-icons/fa";
import { Button } from "react-bootstrap";
import styles from "./Backlog.module.css"
import { baseURL } from "../store/Authentication";
import { requestHeader } from "../constants";
import MessageModal, { MessageTypes } from "../Message/Message";

function Backlog(props){
    const [isLoading,setIsLoading] = useState(false);
    const [time,setTime] = useState(new Date()) 
    const [backlog,setBackLog] = useState(props.data);
    const {exam_id} = useParams();
    const [messageType ,setMessageType]=useState(MessageTypes.ERROR);
    const [message ,setMessage]=useState(null);

    useEffect(()=>{
        setInterval(()=>setTime(new Date()))
    },[])

    const [logs,setLogs] = useState([]);

    const getLogs=async()=>{
        console.log(exam_id)
        const response=await fetch(baseURL + "/exams/" + exam_id + "/logs", {
            method: "GET",
            headers: requestHeader
          });
          const resData = await response.json();
          if (response.status < 400) {
            setBackLog(resData.data);
            setIsLoading(false);
          } else {
            setIsLoading(false);
            const errorMessage = resData.message || "Error getting logs";
            console.log(resData.message)
            setMessageType(MessageTypes.ERROR);
            setMessage(errorMessage);
            // alert(errorMessage);
          }
          console.log(backlog);
          setIsLoading(false);
    }

    const handleClickEnter = () => {
        const arr = [
            {
                "student_id":"6518",
                "name":"someone",
                "action": "Entered",
                "time":time.toLocaleTimeString()
            }
        ];
        setLogs([...logs, ...arr]);
      };

      const handleClickExit = () => {
        const arr = [
            {
                "student_id":"6518",
                "name":"someone",
                "action": "Exited",
                "time":time.toLocaleTimeString()
            }
        ];
        setLogs([...logs, ...arr]);
      };
      
    
    const columns = [
        {
            name : "action",
            selector: (row) => row.action
        },
        {
            name : "student_id",
            selector: (row) => row.student_id
        },
        {
            name : "time_stamp",
            selector : (row) => row.time_stamp
        },
        // {
        //     name : "student_answer",
        //     selector: (row) => row.name
        // },

    ];

    const ExportHandler = () =>
    {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(backlog);
        XLSX.utils.book_append_sheet(wb,ws,"Sheet1");
        XLSX.writeFile(wb,"Logs.xlsx");
    }
    useEffect(()=>{
        getLogs();
        console.log(backlog);
    },[]);

    if(isLoading)
    {
        return <Loading/>;
    }
    
    return(<div className={styles.logsTable}>
        <Button className={styles.exportBtn} onClick={ExportHandler}> <FaFileExport className={styles.exportBtnIcon}/> Export</Button>
        <DataTable
        title = "Backlog"
        columns={columns}
        data = {backlog}
        progressPending = {isLoading}
        pagination
        />
    </div>)
}

export default Backlog;