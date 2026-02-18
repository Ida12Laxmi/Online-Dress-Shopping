from flask import Flask, request, jsonify, redirect
import mysql.connector
from flask_cors import CORS
import os,hmac,hashlib,base64,uuid,json,requests
from flask import send_from_directory
from datetime import datetime,timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db_connection
from orders import orders_bp
from search import search_bp

app=Flask(__name__)
CORS(app)
app.register_blueprint(search_bp)
app.register_blueprint(orders_bp)
UPLOAD_FOLDER="C:/Users/admin/Desktop/javascript/my-app/backend/image/"
os.makedirs(UPLOAD_FOLDER,exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
#orders_bp = Blueprint("orders", __name__, url_prefix="/api")

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name=data.get('fullname')
    email=data.get('email')
    address=data.get('address')
    phone=data.get('phone')
    age=data.get('age')
    password=data.get('password')
    if not all([name,email,address,phone,age,password]):
        return jsonify({"error" : "All fields are required"}),400
    
    hashed_password=generate_password_hash(password)

    try: 
        conn=get_db_connection()
        cursor=conn.cursor()

        cursor.execute("SELECT * FROM customer WHERE cus_email= %s", (email, ))
        if cursor.fetchone():
            return jsonify ({"error" : "Email already registered"}),400
        
        sql="""INSERT INTO customer (cus_name, cus_email, cus_address, cus_age, cus_phone, cus_password)
                 VALUES (%s, %s, %s, %s, %s, %s)"""
        cursor.execute(sql,(name,email,address,age,phone,hashed_password))

        conn.commit()

        return jsonify({"message":"Registration successful"}), 201
    
    except Exception as e:
        print("Error : ",e)
        return jsonify({"error":str(e)}),500
    
    finally:
        cursor.close()
        conn.close()
#LoginAPI

@app.route('/login',methods=['POST'])
def login():
        data=request.get_json()

        email=data.get('email')
        password=data.get('password')

        if not all([email,password]):
            return jsonify({"error":"Email and Passwords are required"}),400
        
        try:
            conn=get_db_connection()
            cursor=conn.cursor(dictionary=True)

            cursor.execute("SELECT * from customer where cus_email=%s",(email,))
            user=cursor.fetchone()

            if not user:
                 return jsonify({"error": "User not found"}), 404
            if not check_password_hash(user['cus_password'],password):
                return jsonify({"error": "Incorrect password"}), 401
            
           # return jsonify({"message": "Login successful"}), 200
        
          # ✅ IMPORTANT: send customer data
            return jsonify({
            "message": "Login successful",
            "customer": {
                "cus_id": user["cus_id"],
                "cus_name": user["cus_name"],
                "cus_email": user["cus_email"]
            }
        }), 200   
        except Exception as e:
             return jsonify({"error": str(e)}), 500
        
        finally:
         cursor.close()
         conn.close()


#DressAPI

@app.route('/dressreg', methods=['GET'])
def get_clothes():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM clothes")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)


# ================= SERVE IMAGE =================
@app.route('/images/<filename>')
def get_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


#Payment
@app.route("/esewa/pay")
def esewa_pay():
    amount = request.args.get("amount")
    # transaction_uuid MUST be unique for every request to avoid "Duplicate ID" errors
    transaction_uuid = str(uuid.uuid4()) 
    product_code = "EPAYTEST"
    secret_key = "8gBm/:&EnhH.1/q" # Correct UAT Secret Key

    # 1. Create the exact message string required by eSewa
    # No spaces between commas and field names
    message = f"total_amount={amount},transaction_uuid={transaction_uuid},product_code={product_code}"

    # 2. Generate HMAC-SHA256 signature
    hmac_sha256 = hmac.new(
        secret_key.encode('utf-8'),
        message.encode('utf-8'),
        hashlib.sha256
    )
    
    # 3. Get digest and encode to Base64
    hash_executable = hmac_sha256.digest()
    signature = base64.b64encode(hash_executable).decode('utf-8')

    return f"""
    <html>
      <body onload="document.forms['esewaForm'].submit()">
        <form name="esewaForm" method="POST" action="https://rc-epay.esewa.com.np/api/epay/main/v2/form">
          <input type="hidden" name="amount" value="{amount}" />
          <input type="hidden" name="tax_amount" value="0" />
          <input type="hidden" name="total_amount" value="{amount}" />
          <input type="hidden" name="transaction_uuid" value="{transaction_uuid}" />
          <input type="hidden" name="product_code" value="{product_code}" />
          <input type="hidden" name="product_service_charge" value="0" />
          <input type="hidden" name="product_delivery_charge" value="0" />
          <input type="hidden" name="success_url" value="http://localhost:3000/payment-success" />
          <input type="hidden" name="failure_url" value="http://localhost:3000/payment-failed" />
          <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code" />
          <input type="hidden" name="signature" value="{signature}" />
        </form>
      </body>
    </html>
    """

@app.route("/khalti/pay")
def khalti_pay():
    amount = request.args.get("amount")
    purchase_order_id = str(uuid.uuid4())
    purchase_order_name = request.args.get("name", "Order_Payment")

    amount_in_paisa = int(float(amount) * 100)

    url = "https://a.khalti.com/api/v2/epayment/initiate/"

    payload = {
        "return_url": "http://localhost:3000/payment-success",
        "website_url": "http://localhost:3000",
        "amount": amount_in_paisa,
        "purchase_order_id": purchase_order_id,
        "purchase_order_name": purchase_order_name,
    }

    headers = {
        "Authorization": "Key edd390e8b8d44f8daea6d5a1b9eb56e1",
        "Content-Type": "application/json",
    }

    response = requests.post(url, json=payload, headers=headers)
    response_data = response.json()

    if "payment_url" in response_data:
        return redirect(response_data["payment_url"])
    else:
        return jsonify(response_data), 400
    
#Paid
@app.route("/cart",methods=['POST'])
def cashinhand():
    try:
        data=request.get_json()
        order_uuid=str(uuid.uuid4())
        conn=get_db_connection()
        cursor=conn.cursor(dictionary=True)
        #Get clothes image from clothes table
        cursor.execute("""SELECT cloth_image from clothes WHERE cid=%s""",(data["c_id"],))
        cloth=cursor.fetchone()
        if not cloth:
            return jsonify({"error":"Cloth not found"}),404
        clothes_image=cloth["cloth_image"]
        cursor.execute("""INSERT INTO orders (order_uuid,cus_id,c_id,amount,payment_method,payment_status,clothes_image) VALUES (%s,%s,%s,%s,%s,%s,%s)""", (
            order_uuid,
            data["cus_id"],
            data["c_id"],
            data["amount"],
            "cash",
            "PENDING",
            clothes_image
        ))
        conn.commit()
        return jsonify({
            "error":"Error",
            "order_uuid":order_uuid
        }),201


    except Exception as e:
        return jsonify({"error":str(e)}),500
    finally:
        cursor.close()
        conn.close()
@app.route("/createorder", methods=['POST'])
def create_order():
    try:
        data = request.get_json()

        idcustomer = data["cus_id"]   # FK from customer table
        cloth_id = data["c_id"]       # FK from clothes table
        amount = data["amount"]
        payment_method = data["payment_method"]  # khalti / esewa

        order_uuid = str(uuid.uuid4())

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

          #Get clothes image from clothes table
        cursor.execute("""SELECT cloth_image from clothes WHERE cid=%s""",(data["c_id"],))
        cloth=cursor.fetchone()
        if not cloth:
            return jsonify({"error":"Cloth not found"}),404
        clothes_image=cloth["cloth_image"]

        cursor.execute("SELECT cus_id FROM customer WHERE cus_id = %s", (idcustomer,))
        if not cursor.fetchone():
         return jsonify({"error": "Invalid Customer ID"}), 400

        sql = """
        INSERT INTO orders (
            order_uuid,
            cus_id,
            c_id,
            amount,
            payment_method,
            payment_status,
            clothes_image
        )
        VALUES (%s, %s, %s, %s, %s, %s,%s)
        """

        cursor.execute(sql, (
            order_uuid,
            idcustomer,
            cloth_id,
            amount,
            payment_method,
            "PENDING",
            clothes_image
        ))

        conn.commit()

        return jsonify({
            "message": "Order created successfully",
            "order_uuid": order_uuid
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

#payment-success
@app.route("/payment-success", methods=["POST"])
def payment_success():
    data=request.get_json()
    order_uuid=data["order_uuid"]
    transaction_id=data["transaction_uuid"]
    conn=get_db_connection()
    cursor=conn.cursor()

    cursor.execute("""
    UPDATE orders
    SET payment_status='PAID',
        transaction_id=%s
    WHERE order_uuid=%s
""", (transaction_id, order_uuid))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message":"Payment verified"}),200

@app.route('/order/<string:order_uuid>',methods=["DELETE"])
def delete_order(order_uuid):
    conn=None
    cursor=None
    try:
        conn=get_db_connection()
        cursor=conn.cursor(dictionary=True)
        cursor.execute("SELECT clothes_image FROM orders where order_uuid=%s",(order_uuid,))
        dress=cursor.fetchone()
        if not dress:
            return jsonify({"error": "Order not found"}), 404
         #Delete image file
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], dress['clothes_image'])
        if os.path.exists(image_path):
            os.remove(image_path)
        cursor.execute("DELETE FROM orders where order_uuid=%s",(order_uuid,))
        conn.commit()
    except Exception as e:
         return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
    return jsonify({"message":"Order deleted"}),200


#==Notification==
@app.route("/notifications/<int:cus_id>",methods=['GET'])
def get_notifications(cus_id):
    print("CUS_ID RECEIVED:", cus_id)
    conn=get_db_connection()
    cursor=conn.cursor(dictionary=True)

    cursor.execute("""
SELECT n.*, c.cloth_name, c.cloth_image 
FROM notifications n 
LEFT JOIN clothes c ON n.c_id = c.cid 
WHERE n.cus_id = %s 
ORDER BY n.created_at DESC 
""", (cus_id,))

    data=cursor.fetchall()
    print("NOTIFICATIONS FOUND:", data)
    cursor.close()
    conn.close()

    return jsonify(data),200

#--APP
if __name__ == '__main__':
    app.run(port=5000, debug=True)



