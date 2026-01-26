import React ,{useState} from "react";
function Dressreg(){
const [formData, setFormData]=useState({

dressname:'',
price:'',
image:null
});
const handleChange = (e)=>{
        if (e.target.name === "upload_image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else{
    setFormData(
        {
            ...formData,[e.target.name]: e.target.value
        }
    );
}
};

const handleSubmit = async (e) => {
    e.preventDefault();

const fd=new FormData();
fd.append("upload_image",formData.image);
fd.append("dressName",formData.dressName);
fd.append("price",formData.price);


 /*  fetch("http://localhost:5000/dressreg", {
        method: "POST",
        body : fd
      headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            image:formData.image,
            dressname: formData.dressName,
            price: formData.price

        })
    })
   /* .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            alert("Post Uploaded Successful!");
            window.location.href="/DressDetails";
        }
    })
    .catch(err => console.log(err));*/

     try {
    const res = await fetch("http://localhost:5000/dressreg", {
      method: "POST",
      body: fd
    });

    const data = await res.json();

    if (res.ok) {
      alert("Post Uploaded Successfully!");
      window.location.href = "/DressDetails";
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Network error");
  } 

};


return(
    
    <div className="register-container">
        <h2>Upload Dresses</h2>
        
        <form onSubmit={handleSubmit} className="register-form">
            
            <input type="hidden" id="id" name="id" required/>
            <label>Image</label>
            <input type="file" id="imageupload" name="upload_image"  onChange={handleChange} accept="image/*" required/>
            <br/>
            <br/>
            <label>DressName</label>
            <input type="text" name="dressName" value={formData.dressName} onChange={handleChange} placeholder="Enter your dress name" required/>
            <br/>
            <br/>
           
            <label>Price</label>
            <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Enter price" required/>
             <br/>
            <br/>
           
<button type="submit">Upload dress</button>
        </form>
    </div>
 
)

  }
export default Dressreg;