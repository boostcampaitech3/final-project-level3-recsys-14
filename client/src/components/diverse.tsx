import React from "react";
import styled from "styled-components";
import { UserContext } from "../context/UserContext";
import 'bootstrap/dist/css/bootstrap.css';
import Carousel from 'react-bootstrap/Carousel';
function Diverse(){
    return(
        <div style={{ display: 'block', width: 700, padding: 30 }}>
         <h4>도전해볼만한 문제</h4>
         <Carousel interval = {null}>
           <Carousel.Item>
             <img
               className="d-block w-100"
                src="https://media.geeksforgeeks.org/wp-content/uploads/20210425122739/2-300x115.png"
               alt="Image One"
             />
             <Carousel.Caption>
               <h3>Label for first slide</h3>
               <p>Sample Text for Image One</p>
             </Carousel.Caption>
           </Carousel.Item>
           
           <Carousel.Item>
             <img
               className="d-block w-100"
                src="https://media.geeksforgeeks.org/wp-content/uploads/20210425122716/1-300x115.png"
               alt="Image Two"
             />
             <Carousel.Caption>
               <h3>Label for second slide</h3>
               <p>Sample Text for Image Two</p>
             </Carousel.Caption>
           </Carousel.Item>
         </Carousel>
       </div>
    );
}
export default Diverse;