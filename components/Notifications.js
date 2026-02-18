import React, {useEffect,useState,useContext} from 'react'
import axios from "axios";
import { AuthContext } from './AuthContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext); // Use context to get the user object

  useEffect(() => {
      // 1. Get the ID from the user object in context
      const cus_id = user?.cus_id; 

      if (!cus_id) {
          console.log("Waiting for user ID...");
          return;
      }

      console.log("Fetching notifications for CUS_ID:", cus_id);

      axios.get(`http://localhost:5000/notifications/${cus_id}`)
          .then((res) => {
              console.log("Notification Data Received:", res.data);
              setNotifications(res.data);
          })
          .catch((err) => console.error("Fetch Error:", err));
  }, [user]);

               return(
                              <div style={{ padding: "20px" }}>
                                             <h2>Notifications</h2>
                                             {notifications.length===0 ? (
                                                <p>No notifications yet</p>
                                             ):(
                                                notifications.map((n) => (
                                                   // Use n.nid instead of n.id
                                                   <div key={n.nid} style={cardStyle}> 
                                                     <img
                                                       // Add a fallback for null images
                                                       src={n.cloth_image ? `http://localhost:5000/images/${n.cloth_image}` : 'https://via.placeholder.com/70'}
                                                       alt="cloth"
                                                       style={imgStyle}
                                                     />
                                                     <div>
                                                       <h4>{n.title}</h4>
                                                       <p>{n.message}</p>
                                                       <small>{new Date(n.created_at).toLocaleString()}</small>
                                                     </div>
                                                   </div>
                                                 ))
                                             )}
                              </div>
               );

};
const cardStyle = {
   display: "flex",
   gap: "15px",
   background: "#f9f9f9",
   padding: "12px",
   marginBottom: "10px",
   borderRadius: "8px",
 };
 
 const imgStyle = {
   width: "70px",
   height: "70px",
   objectFit: "cover",
   borderRadius: "6px",
 };
 
 export default Notifications;