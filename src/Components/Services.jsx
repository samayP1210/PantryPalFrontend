import React from "react";
import ServiceCard from "./ServiceCard";
import { Icon } from "react-icons-kit";
import pantry from "../images/fruit-bowl.png";
import shoppingCart from "../images/shopping-cart.png";
import recipe from "../images/dish.png";
import mealPlanning from "../images/planning.png";

function Services() {
  const size = "40px";

  return (
    <div className="services">
      <h1>Services</h1>
      <div className="bar"></div>
      <br />
      <ServiceCard
        icon={<img src={pantry} />}
        heading={"Pantry"}
        desc={
          "Conveniently manage your pantry inventory, track expiration dates, and receive alerts for items running low or expiring soon."
        }
      />
      <ServiceCard
        icon={<img src={shoppingCart} />}
        heading={"Shopping Cart"}
        desc={
          "Effortlessly add pantry items to your cart, explore suggested ingredients based on your recipes."
        }
      />
      <ServiceCard
        icon={<img src={recipe} />}
        heading={"Recipies"}
        desc={
          "Explore a diverse range of culinary creations, from quick and easy meals to gourmet delights, with step-by-step instructions."
        }
      />
      <ServiceCard
        icon={<img src={mealPlanning} />}
        heading={"Meal Plans"}
        desc={
          "Simplify your meal prep with customized plans tailored to your dietary preferences and delicious meals every day."
        }
      />
    </div>
  );
}

export default Services;
