import classes from "./ExamDetails.module.css"
import {useNavigate, useParams,useLocation} from "react-router-dom"
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import Students from "./Students";
import Results from "./Results";
import { PieChart, Cell, Pie,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { baseURL } from "../store/Authentication";
import { requestHeader } from "../constants";
import Loading from "../Loading/Loading";
import NewExamForm from "./NewExamForm";
import PropTypes from 'prop-types';
import Backlog from "./Backlog";
import MessageModal, { MessageTypes } from "../Message/Message";

function ExamDetails (props){
    const navigate=useNavigate();
    const location = useLocation();
    const [isLoading,setIsLoading]=useState(false);
    const [grades , setGrades]=useState([]);
    // get exam ID from URL
    const {exam_id}= useParams();
    const [exam,setExam]=useState({});
    const [stats,setStats]=useState([]);
    
    const [message, setMessage] = useState(null);
    const [messageType , setMessageType] = useState(null);
    const [onMessageBtnClick, setOnMessageBtnClick] = useState(() => {});
    const totalPoints=location.state.totalPoints;

    const data02 = [
      { name: 'Group A', value: 2400 },
      { name: 'Group B', value: 4567 },
      { name: 'Group C', value: 1398 },
      { name: 'Group D', value: 9800 },
      { name: 'Group E', value: 3908 },
      { name: 'Group F', value: 4800 },
    ];

    const getExam=async()=>{
        setIsLoading(true);
        try{
        const response=await fetch(baseURL + "/exams/" + exam_id, {
            method: "GET",
            headers: requestHeader
          });
          const resData = await response.json();
          if (response.ok) {
            setExam(resData.data);
            setIsLoading(false);
          } else {
            setIsLoading(false);
            const errorMessage = resData.message || "Error getting exam";
            alert(errorMessage);
          }}
          catch(err){
            // console.log(err);
            alert("Error getting exam");
          }
          setIsLoading(false);
    }

    const getStats=async()=>{
      setIsLoading(true);
      const response=await fetch(baseURL + "/exams/" + exam_id + "/stats/", {
          method: "GET",
          headers: requestHeader
        });
        const resData = await response.json();
        if (response.status < 400) {
          setStats(resData.data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          const errorMessage = resData.message || "Error getting stats";
          alert(errorMessage);
        }
        setIsLoading(false);
    }

    const getStudentsGrades=async()=>{
      setIsLoading(true);
      const response=await fetch(baseURL + "/exams/" + exam_id + "/grades/", {
          method: "GET",
          headers: requestHeader
        });
        const resData = await response.json();
        if (response.status < 400) {
          setGrades(resData.data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          const errorMessage = resData.message || "Error getting students";
          alert(errorMessage);
        }
        setIsLoading(false);
  }

  useEffect(()=>{
      getExam();
      getStudentsGrades();
      getStats();
  },[]);

  const updateExam = async (examData) => {
    setIsLoading(true);
    try{
    const response = await fetch(baseURL + "/exams/" + exam_id, {
      method: "PUT",
      headers: requestHeader,
      body: JSON.stringify(examData),
    });
    const resData = await response.json();
    if (response.ok) {
      // alert("Question added successfully");
      setMessageType(MessageTypes.SUCCESS);
      setMessage("Exam updated successfully");
      setOnMessageBtnClick( () => () => setMessage(null));
      // navigate(`/questionbank/${courseID}`);
  }
  else{
      // alert(data.message);
    setMessageType(MessageTypes.ERROR);
    setOnMessageBtnClick(() => () => setMessage(null));
    setMessage(resData.message);
  }}
  catch (err) {
    setMessageType(MessageTypes.ERROR);
    setOnMessageBtnClick(() => () => setMessage(null));
    setMessage("Something went wrong");
  }
  setIsLoading(false);
  };

console.log(stats);

const marks = grades.map(option => option.score).sort((a,b)=>Number(a)-Number(b));;

function mapMarks (array) {
  let a = [],
    arr = [...array], // clone array so we don't change the original when using .sort()
    prev;

  //arr.sort();
  for (let element of arr) {
    if (element !== prev) {
      a.push({result : element , students : 1});
    }
    else ++a[a.length - 1].students;
    prev = element;
  }

  return [a];
}

const mapedmarks = mapMarks(marks);

let sum = 0 ;
for (let i = 0; i < grades.length; i++) {
  sum += Number(grades[i].score) ;
}
let avg = grades.length ? (sum / grades.length).toFixed(2) : 'No grades yet';

if(isLoading){
    return <Loading/>;
}

const percentages50 = marks.filter((a)=>a<totalPoints/2).length;
const percentages60 = marks.filter((a)=>a<totalPoints*0.6 && a>=totalPoints/2).length;
const percentages70 = marks.filter((a)=>a<totalPoints*0.7 && a>=totalPoints*0.6).length;
const percentages80 = marks.filter((a)=>a<totalPoints*0.8 && a>=totalPoints*0.7).length;
const percentages90 = marks.filter((a)=>a<totalPoints*0.9 && a>=totalPoints*0.8).length;
const percentages100 = marks.filter((a)=>a>totalPoints*0.9).length;

    const percentages = [
      { name: 'Less than 50%', value: percentages50 ,color:'#0088FE' },
      { name: '50% --> 60%', value: percentages60 ,color:'red'  },
      { name: '60% --> 70%', value: percentages70 ,color:'green' },
      { name: '70% --> 80%', value: percentages80 ,color:'purple' },
      { name: '80% --> 90%', value: percentages90 ,color:'yellow'},
      { name: '90% --> 100%', value: percentages100 ,color:'#00008B'},
    ];
    const data01 = percentages.filter((a)=>a.value>0);
    //const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
    return(
    <div className={classes.div}>
      {message && <MessageModal message={message}  type={messageType} onButtonClicked={onMessageBtnClick}/>}
    <Tabs>
        <TabList className="tabsnav">
          <Tab><h1 name="tab">Students</h1></Tab>
          <Tab><h1 name="tab">Results</h1></Tab>
          <Tab><h1 name="tab">Statistics</h1></Tab>
          <Tab><h1 name="tab">Exam Settings</h1></Tab>
          <Tab><h1 name="tab">Logs</h1></Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
          <h1><Students /> </h1>
          </TabPanel>
          <TabPanel>
            <h1><Results grades={grades} /></h1>
          </TabPanel>
          <TabPanel>
          {grades.length ? <div className={classes.statistics}>
          {/* <h1>Number of students = {grades.length}</h1> */}
          <h1>Number of attended students = {stats.number_of_students-stats.number_of_absent_students} / {stats.number_of_students}</h1>
          <h1>Average Score = {stats.avg_score} / {totalPoints}</h1>
          <h1>Success rate = {(marks.filter((a)=>a>=totalPoints/2).length / grades.length*100).toFixed(2)}%</h1>
          <h1>Grades Graph : </h1>
          </div> : <h1 className={classes.noStats}>no statistics available yet</h1>}
          {grades.length!=0 && <div className={classes.splitscreen}>
          <div className={classes.graph}>
          <ResponsiveContainer width="100%" aspect={2}>
        <LineChart
          width={500}
          height={300}
          data={mapedmarks[0]}
          margin={{
            top: 20,
            right: 30,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="result" domain={[0,totalPoints]}/>
          <YAxis dataKey="students" allowDecimals={false} domain={[0, grades.length]} scale="auto"/>
          <Tooltip />
          <Legend />
          <Line type="monotone" legendType="none" dataKey="students" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
      </div>
      <div className={classes.pie}>
      <PieChart width={400} height={200}>
          <Pie
            data={data01}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data01.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
        {
          data01.map((a)=><div className={classes.legend}>{a.name}<text style={{ color: a.color }} name="dot">. <br/></text></div>)
        }
        </div>
        </div>}
          </TabPanel>
          <TabPanel>
          <NewExamForm createExam={updateExam} exam={exam}/>
          </TabPanel>
          <TabPanel>
            <h1><Backlog/></h1>
          </TabPanel>

        </TabPanels>
      </Tabs>
      </div>);
}


export default ExamDetails;