import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokenContext, url, userIdContext } from "../App";
import OverComponent from "./OverComponent";
import background from "../images/pantryBg2.jpg";
import Services from "./Services";
import Featured from "./Featured";
import { Toaster } from "react-hot-toast";


function Home() {
  const { token, setToken } = useContext(tokenContext);
  const {setUserId} = useContext(userIdContext)

  const nav = useNavigate();

  useEffect(() => {
    if (!token) {
      nav("/login");
      return;
    }

      // fetch(`${url}/user/`, {
      //   method: "get",
      //   headers: {
      //     "Content-type": "application/json",
      //     authorization: `Bearer ${token}`,
      //   },
      // })
      //   .then((res) => res.json())
      //   .then((data) => {
      //     if (data.status === "success") {
      //       setUserId(data.userID);
      //       console.log(data.userId)
      //     } else{
      //       setToken("");
      //       nav("/login");
      //     }
      //   }).catch(err => nav('/server-down'))
  }, []);

  return (
    <div style={{ overflow: "hidden" }}>
            <Toaster position="top-right" />
      <div className="section" style={{backgroundImage :`url(${background})` }}>
        <OverComponent
          heading={"Organised Pantry"}
          subHeading={"Manage your items easily and effectively"}
          btn={"Pantry"}
          link={"/pantry"}
        />
      </div>
      <Services />
      <Featured />
    </div>
  );
}
{
  /* <iframe widatah="100%" height="100%" frameborder="0" marginheight="0" marginwidatah="0" title="map" scrolling="no" src="https://maps.google.com/maps?widatah=100%&amp;height=600&amp;hl=en&amp;q=%C4%B0zmir+(My%20Business%20Name)&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed" style="filter: grayscale(1) contrast(1.2) opacity(0.4);"></iframe> */
}

{
  /* <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3773.956302954911!2d47.514091774453995!3d-18.93332820804669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTjCsDU2JzAwLjAiUyA0N8KwMzEnMDAuMCJF!5e0!3m2!1sen!2sin!4v1709059316231!5m2!1sen!2sin" widatah="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */
}
export default Home;
