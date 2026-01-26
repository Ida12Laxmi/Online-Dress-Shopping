import React ,{useState} from "react";
import './Register.css';
function Register(){
const [formData, setFormData]=useState({

fullName:'',
email:'',
address:'',
age:'',
gender:'',
password:'',
confirmPassword:''
});
const handleChange = (e)=>{
    setFormData(
        {
            ...formData,[e.target.name]: e.target.value
        }
    );
};

const handleSubmit = (e) => {
    e.preventDefault();

if (formData.password !== formData.confirmPassword){
    alert("Passwords do not match");
    return;
}

 fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fullname: formData.fullName,
            email: formData.email,
            address: formData.address,
            age: formData.age,
            phone: formData.phone,
            password: formData.password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            alert("Registration Successful!");
            window.location.href="/login";
        }
    })
    .catch(err => console.log(err));
};


return(
    
    <div className="register-container">
        <h2>Create Account</h2>
        
        <form onSubmit={handleSubmit} className="register-form">
            <label>FullName</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" required/>
            <br/>
            <br/>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" required/>
             <br/>
            <br/>
            <label>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter address" required/>
             <br/>
            <br/>
            <label>Phone Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter Number" required/>
             <br/>
            <br/>

            <label>Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Enter age" required/>
             <br/>
            <br/>

            <label>Gender</label>
            <input type="radio" name="gender" value="Female" checked={formData.gender=="Female"} onChange={handleChange} required/>Female
            <input type="radio" name="gender" value="Male" checked={formData.gender=="Male"} onChange={handleChange} required/>Male
             <br/>
            <br/>
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required/>
            
             <br/>
            <br/>
            <label>Checked Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required/>
             <br/>
            <br/>

<button type="submit">Register</button>
        </form>
    </div>
 
)

  }
export default Register;