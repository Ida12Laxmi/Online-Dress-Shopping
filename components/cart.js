import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import esewa from "./react/esewa.png";
import khalti from "./react/khalti.jpeg";


function Cart() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const dress = state?.dress;

  const [payment, setPayment] = useState("cash");

  //Handler through cash in hand
  const handleCashhand = async () => {
  const customerStr = localStorage.getItem("customer");

  // ✅ SAFETY CHECK
  if (!customerStr || customerStr === "undefined") {
    alert("Please login first");
    navigate("/login");
    return;
  }

  let customer;
  try {
    customer = JSON.parse(customerStr);
  } catch (err) {
    console.error("Invalid customer JSON:", customerStr);
    alert("Session error, please login again");
    localStorage.clear();
    navigate("/login");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cus_id: customer.cus_id,   // ✅ correct
        c_id: dress.cid,
        amount: dress.cloth_price
       // cloth_image:dress.cloth_image
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Order placed successfully (Cash on Delivery)");
    } else {
      alert(data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};


  //Handler of khalti

  const handlekhaltiPayment=()=>{
    window.location.href = `http://localhost:5000/khalti/pay?amount=${dress.cloth_price}&name=${dress.cloth_name}`;
  };

  if (!dress) return <h3>No item in cart</h3>;

  // ✅ Correct eSewa redirect
  const handleEsewaPayment = () => {
    window.location.href = `http://localhost:5000/esewa/pay?amount=${dress.cloth_price}&name=${dress.cloth_name}`;
  };

  return (
    
    
    <div className="cart-container">
      <h2>Your Cart</h2>

      <div className="cart-card">
        <img
          src={`http://localhost:5000/images/${dress.cloth_image}`}
          alt="dress"
        />
        <h3>{dress.cloth_name}</h3>
        <p>Rs. {dress.cloth_price}</p>
      </div>

      <h3>Select Payment Method</h3>

      <label>
        <input
          type="radio"
          value="cash"
          checked={payment === "cash"}
          onChange={() => setPayment("cash")}
        />
        Cash on Delivery
      </label>

      <br />

      <label>
        <input
          type="radio"
          value="online"
          checked={payment === "online"}
          onChange={() => setPayment("online")}
        />
        Online Payment
      </label>

      <br /><br />

      {payment === "cash" && (
        <button className="pay-btn" onClick={handleCashhand}>Place Order</button>
      )}

      {payment === "online" && (
        <>
          <img src={esewa} alt="eSewa" height="40" />
          <br /><br />
          <button className="pay-btn" onClick={handleEsewaPayment}>
            Pay with eSewa
          </button>
        </>
      )}
<br/><br/>
       {payment === "online" && (
        <>
          <img src={khalti} alt="khalti" height="40" />
          <br /><br />
          <button className="pay-btn" onClick={handlekhaltiPayment}>
            Pay with khalti
          </button>
        </>
      )}
    </div>
    
  ); 

}

export default Cart;
