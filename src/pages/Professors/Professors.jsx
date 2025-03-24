import React from "react";
import cssModules from "./Professors.module.css"
import { baseURL, isAdmin, getAuthToken,getUserID } from "../../components/store/Authentication";
import { useEffect, useState } from "react";
import ProfessorForm from "../../components/Professor/ProfessorForm";
import * as FaIcons from 'react-icons/fa';
import Unauthorized from "../../components/ui/Unauthorized";
import MessageModal, { MessageTypes } from "../../components/Message/Message";


// showing all professors in the system
// only admin can access this page
export default function Professors() {
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProfDialog, setShowProfDialog] = useState(false);
    const [currProfessor, setCurrProfessor] = useState({});
    const [isEdit , setIsEdit] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(MessageTypes.ERROR);
   
    const getAllProfessors = () => {
        setLoading(true);
        fetch(baseURL + "/professors"
            , {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getAuthToken('token'),
                }
            })
            .then(res => {
                if (res.ok)
                    return res.json()
                else {
                    return Promise.reject(res);
                }
            }
            )

            .then(data => {
                // check response status
                const professors = data.data;
                setProfessors(professors);
                setLoading(false);
            })
            .catch(res => {
                res.json().then(data => {
                    const message = data.message || "Something went wrong";
                    // alert(message);
                    setMessageType(MessageTypes.ERROR);
                    setMessage(message);
                    setLoading(false);
                })
            }
            );
        setLoading(false);
    };
    const createProfessor = (professor) => {
        setLoading(true);
        fetch(baseURL + "/professors"
            , {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getAuthToken('token'),
                },
                body: JSON.stringify(professor)
            })
            .then(res => {
                if (res.status <400)
                    return res.json();
                else {
                    return Promise.reject(res);
                                }
            })
            .then(data => {
                // setProfessors([...professors, data.data]);
                getAllProfessors();
                setLoading(false);
                console.log(data);
                // alert("Professor Added Successfully");
                setMessage("Professor Added Successfully");
                setMessageType(MessageTypes.SUCCESS);
            })
            .catch(res => {
                res.json().then(data => {
                    const message = data.message || "Something went wrong";
                    // alert(message);
                    console.log(data);
                    setMessage(message);
                    setMessageType(MessageTypes.ERROR);
                    setLoading(false);
                })
            }
            );
        setLoading(false);
    };

    const updateProfessor = (professor) => {
        setLoading(true);
        fetch(baseURL + "/professors/" + professor.id
            , {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getAuthToken('token'),
                },
                body: JSON.stringify(professor)
            })
            .then(res => {
                if (res.ok)
                    return res.json();
                else {
                    return Promise.reject(res);
                                }
            })
            .then(data => {
                // setProfessors([...professors, data.data]);
                getAllProfessors();
                setLoading(false);
                // alert("Professor Added Successfully");
                setMessage("Professor Updated Successfully");
                setMessageType(MessageTypes.SUCCESS);
            })
            .catch(res => {
                res.json().then(data => {
                    const message = data.message || "Something went wrong";
                    // alert(message);
                    setMessage(message);
                    setMessageType(MessageTypes.ERROR);
                    setLoading(false);
                })
            }
            );
        setLoading(false);
    };


    const deleteProfessor = (id) => {
        setLoading(true);
        fetch(baseURL + "/professors/" + id
            , {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getAuthToken('token'),
                }
            })
            .then(res => {
                if (res.ok)
                    return res.json();
                else {
                    return Promise.reject(res);
                }
            })
            .then(data => {
                getAllProfessors();
                setLoading(false);
                setMessage("Professor Deleted Successfully");
                setMessageType(MessageTypes.SUCCESS);
                // alert("Professor Deleted Successfully");
            })
            .catch(res => {
                res.json().then(data => {
                    const message = data.message || "Something went wrong";
                    // alert(message);
                    setMessage(message);
                    setMessageType(MessageTypes.ERROR);
                    setLoading(false);
                })
            }
            
            );
        setLoading(false);
    };

    useEffect(() => {
        if(isAdmin())
            getAllProfessors();
    }, []);


    if(!isAdmin()){
        return <Unauthorized/>
    }

    if (loading) {
        return (<div className={cssModules.loading_dialog}>
            <div className={cssModules.spinner}></div>
            <div className={cssModules.message}>Loading...</div>
        </div>);
    }

    return (
        <>
            {message && <MessageModal message={message}  type={messageType}
             onButtonClicked={()=>{setMessage(null)}}/>}
            <div className={cssModules.container}>
                <div className={cssModules.newProf}>
                    <h1>Professors In The System</h1>
                    <button onClick={() =>{
                        setCurrProfessor(null);
                        setShowProfDialog(true);
                        setIsEdit(false);
                    }} className={cssModules.addProfBtn}>
                        <FaIcons.FaUserPlus />

                        <span className={cssModules.addIcon}>Add New Professor</span>

                    </button>
                    <ProfessorForm
                        showDialog={showProfDialog}
                        setShowDialog={setShowProfDialog}
                        onFormSubmit={isEdit?updateProfessor:createProfessor} 
                        professor={currProfessor}
                    />
                </div>

                <table className={cssModules.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {professors.map((professor) => {
                            // exclude the current user from the list
                            if (professor.id === parseInt(getUserID())) {
                                return null;
                            };
                            return (
                                <tr key={professor.id}>
                                    <td>{professor.name}</td>
                                    <td>
                                        <a href={"mailto:" + professor.email}>{professor.email}</a>
                                    </td>
                                    <td>{professor.is_admin?'Admin':'Professor'}</td>
                                    <td>
                                        <button className={cssModules.edit} onClick={
                                            () => {
                                                // console.log(professor);
                                                setCurrProfessor(professor);
                                                setIsEdit(true);
                                                setShowProfDialog(true);
                                            }
                                        } >Edit</button>
                                        <button className={cssModules.delete} onClick={
                                            () => {
                                                deleteProfessor(professor.id);
                                            }
                                        }>Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>






            </div>

        </>
    );

}