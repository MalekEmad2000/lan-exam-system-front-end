 
import './App.css';
import Layout from './components/layouts/Layout';
import AllExams from "./pages/AllExams"
import NewExam from "./pages/NewExam";
import ExamQuestions from './pages/ExamQuestions';
import Login from './pages/Login';
import NewQuestion from './pages/NewQuestion';
import Courses from "./pages/Courses";
import CoursesQuestionBank from './pages/QuestionBank/QuestionBankCourses';
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Results from './components/exam/Results';
import Students from './components/exam/Students'
import Profile from './pages/Profile/Profile';
import Professors from './pages/Professors/Professors';
import { isAdmin } from './components/store/Authentication';
import Unauthorized from './components/ui/Unauthorized';
import CourseQuestions from './pages/QuestionBank/CourseQuestions';
import Sections from './components/questions/Sections';
import ExamDetails from './components/exam/ExamDetails';
import { StudentAnswer } from './components/StudentAnswer/StudentAnswer';
import Backlog from './components/exam/Backlog';
import AddQuestionToBank from './pages/QuestionBank/AddQuestion';

const router=createBrowserRouter([

 {path:'/', element:<Login/> },
 {path:'/',
 element:<Layout/>,
 children:[
 {path:'/home', 
 element:<AllExams/>
},
 {path:'/NewExam',
 element:<NewExam/>
},
{
  path:'/questionBank',
  element:<CoursesQuestionBank/>
},
{
  path:'/questionBank/:courseID',
  element:<CourseQuestions/>
},
{
  path:'/questionBank/:courseID/addQuestion',
  element:<AddQuestionToBank/>
},
 {path:'/ExamQuestions/:examId/section/:sectionID/:courseID',
 element:<ExamQuestions/>
},
 {path:'/newQuestion/:examId',
 element:<NewQuestion/>
},
 {path:'/Courses',
 element:<Courses/>
},
 {path:'/Results',
 element:<Results/>
},
 {path:'/Students',
element:<Students/>
},
{
  path:'/profile',
  element:<Profile/>
},
{
  path:'/professors',
  element: <Professors/>
},
{
  path:'/sections/:examID/:courseID',
  element:<Sections/>
},
{
  path:'/:exam_id/ExamDetails',
  element:<ExamDetails/>
},
{
  path:'/:exam_id/ExamDetails/StudentAnswer/:student_id',
  element:<StudentAnswer/>
},
{
  path:'/Backlog/:examId',
  element:<Backlog/>
}


]}


])


function App() {



  return (
  


<RouterProvider router={router}/>
 
  );
}

export default App;
