import React, { useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Navigate.css";
import logo from "./react/logo.png";

function Navbar(){
    const {user,logout}=useContext(AuthContext);
   const navigate=useNavigate();
   
   const handleLogout=()=>{
    logout();
    navigate("/login");
   };
   return(
       <nav className="navbar" style={{ padding: "10px", background: "#333", color: "#fff", display: "flex", justifyContent: "space-between" }}>
        <div className="logo-container" onClick={() => navigate("/")}>
            <div className="logo-circle">
            <img src={logo} alt="Boutique Logo" className="logo-img" />
            </div>
               <h2 className="logo"  style={{cursor: 'pointer'}}>Buy Dress</h2>
               </div>
               <ul className="nav-links">
               <div>
                {/* Visual Check: This will show you exactly who is logged in */}
                {user ? (
                    <span>Welcome, <b>{user.cus_name}</b> </span>
                ) : (
                    <span></span>
                )}
            </div>
            {user && (
                    <li><Link to="/Chatbot">ChatWithAI</Link></li>
                  
                )}
            {user && (
                    <li><Link to="/Notifications">Notifications</Link></li>
                  
                )} 
                
                {user && (
                    <li><Link to="/MyOrders">My Orders</Link></li>
                  
                )}
                 {user && (
                    
                    <li><Link to="/DressDetails">Dresses</Link></li>
                )}
                 {user && (
                    
                    <li><Link to="/AboutUs">AboutUS</Link></li>
                )}

                {!user ? (
                     <>
                     <li><Link to="/login">Login</Link></li>
                     </>
                ):(<li className="logout" onClick={handleLogout}>Logout</li>)}
               </ul>
       </nav>
   );
}
export default Navbar;
