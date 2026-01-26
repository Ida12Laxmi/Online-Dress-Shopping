import React from "react";
import './Card.css';
import frock from "./react/frock.png";
import op from "./react/op.png";
import l from "./react/l.png";
import ss from "./react/ss.png";
import saree from "./react/saree.png";
import gown from "./react/gown.png";

function Card()
{
    return(
        <div className="card-container">
        <div className="card">
            <img src={frock} alt="Summer Frock"></img>
            <h2>Frocknp</h2>
            <p>Price : 2500</p>
            <button>Buy</button>
        </div>

         <div className="card">
            <img src={op} alt="One Piece"></img>
            <h2>One Piece</h2>
            <p>Price : 2000</p>
            <button>Buy</button>
        </div>

         <div className="card">
            <img src={l} alt="Lehenga"></img>
            <h2>Lehenga</h2>
            <p>Price : 5500</p>
            <button>Buy</button>
        </div>

         <div className="card">
            <img src={ss} alt="Salwar Suit"></img>
            <h2>Salwar Suit</h2>
            <p>Price : 3500</p>
            <button>Buy</button>
        </div>

         <div className="card">
            <img src={saree} alt="Saree"></img>
            <h2>Saree</h2>
            <p>Price : 3500</p>
            <button>Buy</button>
        </div>

         <div className="card">
            <img src={gown} alt="Gown"></img>
            <h2>Gown</h2>
            <p>Price : 3500</p>
            <button>Buy</button>
        </div>

        </div>
    );
  
}
export default Card;