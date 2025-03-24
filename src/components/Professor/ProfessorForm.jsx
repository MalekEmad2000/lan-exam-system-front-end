import React, { useEffect, useState } from "react";
import styles from "./ProfessorForm.module.css";

function ProfessorForm(props) {
    const professor = props.professor;
    const [name, setName] = useState(!professor?.name ? "" : professor.name);
    const [email, setEmail] = useState(!professor?.email ? "" : professor.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(professor?.is_admin || false);
    // console.log("isAdmin", isAdmin);
    const showDialog = props.showDialog;
    const setShowDialog = props.setShowDialog;
    const onFormSubmit = props.onFormSubmit;
    useEffect(() => {
        setName(!professor?.name ? "" : professor.name);
        setEmail(!professor?.email ? "" : professor.email);
    }, [professor]);

    const handleSubmit = (e) => {

        e.preventDefault();
        setEmail(e.target.email.value);
        setName(e.target.name.value)
        // console.log("submitting form");
        // validate the form
        console.log(name, email, password, confirmPassword);
        // setEmail(e.target)
        if (email.trim().length === 0 ||!name || name.trim().length === 0 ) {
              alert("Please enter a valid name and email");
            return;
        }
        if (password && (password.trim().length === 0 || confirmPassword.trim().length === 0)) {
            alert("Please enter a valid password");
            return;
        }
        if (password && password !== confirmPassword) {
            alert("Passwords don't match");
            //setMessage("Passwords don't match");
            return;
        }
        
        // create a professor object
        const newProfessor=professor?.id? {
            id:professor.id,
            name: name,
            email: email,
            password: password,
            is_admin: isAdmin
        }:{      
            name: name,
            email: email,
            password: password,
            is_admin: isAdmin
        }
        // call the parent function
        onFormSubmit(newProfessor);

        // close the dialog
        setShowDialog(false);
    };
    return (
        <div>

            {showDialog && (
                <div className={styles.dialog}>
                    <div className={styles.dialogContent}>
                        <h2>Enter Professor Information:</h2>
                        <form name="professorForm" onSubmit={handleSubmit}>
                            <label name="professorLabel" htmlFor="name">Name:</label>
                            <input inputName="professorInput"
                                type="text"
                                id="name"
                                name="name"
                                defaultValue={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <label name="professorLabel" htmlFor="email">Email:</label>
                            <input inputName="professorInput"
                                type="email"
                                id="email"
                                name="email"
                                defaultValue={email}
                                disabled={professor?.email ? true : false}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {!professor?.id && (
                                <><label name="professorLabel" htmlFor="password">Password:</label><input inputName="professorInput"
                                    type="password"
                                    id="password"
                                    name="password"
                                    defaultValue={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required />
                                    <label name="professorLabel" htmlFor="confirmPassword">Confirm Password:</label><input inputName="professorInput"
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        defaultValue={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required />


                                </>

                            )
                            }
                            <div className={styles.isAdminDiv}>

                            <label name="isAdminLabel" htmlFor="isAdminInput">Is Admin ?</label>
                            <input 
                                type="checkbox"
                                id="isAdminInput"
                                name="isAdminInput"
                                // defaultValue={isAdmin}
                                defaultChecked={isAdmin}
                                // checked={isAdmin}
                                onChange={(e) => {
                                    setIsAdmin(!isAdmin);
                                                                }
                            }
                                
                            />
                            </div>

                            <button name="professorSubmit" type="submit">
                                {professor?.id ? "Update Professor" : "Add Professor"}
                            </button>
                        </form>
                        <button className={styles.closeBtn} onClick={() => setShowDialog(false)}>
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfessorForm;
