import React, { useState, useEffect } from "react";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null);    // Track errors

    useEffect(() => {
       
            const userData = localStorage.getItem("user");
            if (!userData) {
                setError("Please Login First")
                setLoading(false);
                return;
            }
            try {
            const parsedUser = JSON.parse(userData);
            // Check if cus_id is nested or direct
            const customerId = parsedUser.customer ? parsedUser.customer.cus_id : parsedUser.cus_id;

            if (!customerId) {
                console.error("No Customer ID found in localStorage!");
                setError("Login session invalid. Please log in again.");
                setLoading(false);
                return;
            }

            fetch(`http://localhost:5000/api/orders?cus_id=${customerId}`)
                .then(res => {
                    if (!res.ok) throw new Error("Backend server error");
                    return res.json();
                })
                .then(data => {
                    setOrders(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        } catch (e) {
            setError("Failed to parse user data.");
            setLoading(false);
        }
    }, []);

    const userData = localStorage.getItem("user");
    if (!userData) return <div><h2>My Orders</h2><p>Please login first.</p></div>;
    if (loading) return <div><h2>My Orders</h2><p>Loading your orders...</p></div>;
    if (error) return <div><h2>My Orders</h2><p>Error: {error}</p></div>;
    if (orders.length === 0) return <div><h2>My Orders</h2><p>No orders found.</p></div>;

    return (
        <div>
            <h2>My Orders</h2>
            <table border="1" cellPadding="10" cellSpacing="0" width="100%">
                <thead style={{ background: '#f5f5f5' }}>
                    <tr>
                        <th>Image</th><th>Cloth Name</th><th>Amount</th><th>Status</th><th>Payment</th><th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.order_uuid}>
                            <td><img src={`http://localhost:5000/images/${order.clothes_image}`} alt="cloth" width="120" /></td>
                            <td><b>{order.cloth_name}</b></td>
                            <td>Rs.{order.amount}</td>
                            <td>{order.payment_status}</td>
                            <td>{order.payment_method}</td>
                            <td>{order.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default MyOrders;