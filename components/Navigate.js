import React, { useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Navigate.css";

function Navbar(){
    const {user,logout}=useContext(AuthContext);
   const navigate=useNavigate();
   
   const handleLogout=()=>{
    logout();
    navigate("/login");
   };
   return(
       <nav className="navbar">
               <h2 className="logo" onClick={() => navigate("/")} style={{cursor: 'pointer'}}>Buy Dress</h2>
               <ul className="nav-links">
                
                {user && (
                    <li><Link to="/MyOrders">My Orders</Link></li>
                  
                )}
                 {user && (
                    
                    <li><Link to="/DressDetails">Dresses</Link></li>
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