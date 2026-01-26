import React, {useContext, useState} from 'react';
import './Login.css';
import { useNavigate } from "react-router-dom";
import { AuthContext } from './AuthContext';
function Login(){
    const navigate = useNavigate();
    const {login}=useContext(AuthContext);
const [email, setEmail]=useState("");
const [password, setPassword] = useState("");

const handlelogin = async() =>{
    if(!email || !password){
        alert("Please fill all field");
        return;
    }
    try{

const response = await fetch("http://localhost:5000/login",{ 
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({email,password})

});

const data = await response.json();

if(response.ok){
    alert("Login Successful");
    login(data.customer);
    //localStorage.setItem("customer",JSON.stringify(data.customer));
    navigate("/DressDetails");
}
else{
    alert(data.error);
}
}
catch(error){
console.error("Login error",error);
alert("Error occurred");
}
};

return(
<div className="form-container">
    <h1>Login</h1>

    <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>

     <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>

     <button onClick={handlelogin}>Login</button>

 {/* Register link */}
    <p style={{ marginTop: "15px" }}>
        Don't have an account?{" "}
        <a href="/Register" style={{ color: "#007bff", textDecoration: "none" }}>
            Register here
        </a>
    </p>

</div>
);

}
export default Login;
