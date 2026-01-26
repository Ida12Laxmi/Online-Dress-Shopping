import React, { useEffect, useState } from "react";
import './DressDetails.css';
import {useNavigate} from "react-router-dom";

function DressDetails(){
    const [dresses, setDresses]=useState([]);
    const[searchTerm,setSearchTerm]=useState("")
    const navigate=useNavigate();

    const handleSearch=()=>{
        fetch((`http://localhost:5000/searchdresses?query=${searchTerm}`))
         .then(res=>res.json())
         .then(data=>{
            setDresses(data);
         })
         .catch(err=>console.error(err))
    };

    //Fetch all dresses

    useEffect(() => {
        fetch("http://localhost:5000/dressreg")
        .then(res => res.json())
        .then(data=>{
            setDresses(data);
        })
        .catch(err=>console.log(err));
    }, []
);



return (
    <div>
      
        <input type="text" className="search-input" placeholder="search dress" onChange={(e) => setSearchTerm(e.target.value)}/>
        <button className="search-button" onClick={handleSearch}>Search</button>  
    <div className="dress-container">
       
        <button className="add-btn" onClick={() => navigate("/dressreg")}>Add Post</button>
        <h2>Dresses</h2><br/>
        
        <div className="card-container">
            {dresses.map((dress,index) =>(
            <div className="dress-card" key={index}>
                <img
  src={`http://localhost:5000/images/${dress.cloth_image}`}
  alt="dress"
/>
                <h3>{dress.cloth_name}</h3>
                <p>Rs. 
                    {dress.cloth_price}
                </p>
                 <button className="buy-btn"  onClick={() => navigate("/cart", { state: { dress } })}>Buy</button>
            </div>
            ))}

        </div>

    </div>
    </div>
)

}
export default DressDetails;