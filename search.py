from flask import Flask, request, jsonify, Blueprint,send_from_directory
from database import get_db_connection
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS
app=Flask(__name__)
CORS(app)

search_bp = Blueprint('search_bp', __name__)

#Load AI model
model = SentenceTransformer('all-MiniLM-L6-v2')

def fetch_dresses():
    conn=get_db_connection()
    cursor=conn.cursor(dictionary=True)
    cursor.execute("SELECT * from clothes")
    data=cursor.fetchall()
    cursor.close()
    conn.close()
    return data
#AI search
@search_bp.route('/searchdresses',methods=['GET'])
def search_dresses():
    query=request.args.get('query')
    if not query:
        return jsonify({"error":"Search query missing"}),400
    dresses=fetch_dresses()
    #Combine dresses info for AI understanding
    dress_texts=[
        f"{d['cloth_image']} {d['cloth_name']} {d['cloth_price']}"
        for d in dresses
    ]
    #Convert text to vectors
    dress_vectors=model.encode(dress_texts)
    query_vector=model.encode([query])

    #similarity calculation
    similarities=cosine_similarity(query_vector,dress_vectors)[0]

    #Rank results
    results=[]
    for i, score in enumerate(similarities):
        if score>0.03:  # relevance threshold
            dress=dresses[i]
            dress["score"]=float(score)
            results.append(dress)
    results.sort(key=lambda x:x["score"],reverse=True)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)


