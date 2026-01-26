from flask import request, jsonify, Blueprint
from database import get_db_connection # Ensure this import is correct

orders_bp = Blueprint("orders", __name__, url_prefix="/api")

@orders_bp.route("/orders", methods=["GET"])
def orders():
    cus_id = request.args.get("cus_id")
    if not cus_id:
        return jsonify({"error": "Customer ID required"}), 400
    
    # 1. Initialize connection INSIDE the function
    conn = get_db_connection()
    try:
        # 2. Create the cursor INSIDE the function
        cursor = conn.cursor(dictionary=True)
        
        query = """
        SELECT 
            o.order_uuid,
            o.amount,
            o.payment_method,
            o.payment_status,
            o.created_at,
            o.clothes_image,
            c.cloth_name,
            c.cloth_price
        FROM orders o
        JOIN clothes c ON o.c_id = c.cid  
        WHERE o.cus_id = %s
        ORDER BY o.created_at DESC
        """
        
        cursor.execute(query, (cus_id,))
        orders_data = cursor.fetchall()
        
        # 3. Always close the cursor and connection
        cursor.close()
        return jsonify(orders_data), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
    finally:
        # 4. Use 'finally' to ensure the connection closes even if there is an error
        conn.close()