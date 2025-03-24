import {redirect}  from 'react-router-dom'
export function getAuthToken(){

const token=localStorage.getItem('token');
return token;

}
export function getUserID(){

    const id=localStorage.getItem('id');
    return id;
    
}
export function getUserEmail(){

    const email=localStorage.getItem('email');
    return email;
    
}
export function isAdmin(){

    const admin=localStorage.getItem('admin');
    // console.log('admin', admin);
    // change string to boolean
    return admin==="true";
    
}
export function getUserName(){


return localStorage.getItem('name');

}

// reset user data
export function setUserData(email,id,name){
    localStorage.setItem('email',email);
    localStorage.setItem('id',id);
    localStorage.setItem('name',name);
}


    

export function logout(){

localStorage.removeItem('token');
localStorage.removeItem('id');
localStorage.removeItem('email');
localStorage.removeItem('admin');
localStorage.removeItem('name');


}


export const baseURL="http://lan-exam.us-east-2.elasticbeanstalk.com/api";
//export const baseURL="http://localhost:3030/api";  
