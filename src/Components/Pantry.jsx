import React, { useContext, useEffect, useState } from "react";
import OverComponent from "./OverComponent";
import ItemCard from "./ItemCard";
import { useNavigate } from "react-router-dom";
import { tokenContext, url } from "../App";
import background from "../images/pantryBg.jpg";
import { Toaster } from "react-hot-toast";
import emptyPantry from '../images/emptyPantry.png'

function Pantry() {
  const { token } = useContext(tokenContext);
  const [query, setQuery] = useState("");
  const [pantryItems, setPantryItems] = useState("[]");
  const nav = useNavigate();

  const category = ["Sauces", "Veggies", "Fruits", "Meat", "Spices", "Dairy", "Other"];

  useEffect(() => {
    if (!token) {
      nav("/login");
    }

    fetch(`${url}/items/pantry-items/${query}`, {
      method: "get",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPantryItems(JSON.stringify(data.pantryItems));
        // console.log(data.pantryItems);
      })
      .catch((err) => nav("/server-down"));
  }, [query]);

  function getItem(cat) {
    var items = [];
    {
      pantryItems &&
        JSON.parse(pantryItems).map((item) => {
          // console.log(pantryItems)
          if (item.category === cat)
            items.push(
              <ItemCard
                item={JSON.stringify(item)}
                color={getColor(cat)}
                pantryItems={pantryItems}
                setPantryItems={setPantryItems}
              />
            );
        });
    }
    return items.length === 0 ? null : items;
  }

  function getColor(category) {
    switch (category) {
      case "Sauces":
        return "#FF7F50";
      case "Veggies":
        return "#9DC183";
      case "Fruits":
        return "#FFDAB9";
      case "Dairy":
        return "#FFF8E1";
      case "Meat":
        return "#979593";
      default:
        return "#D95677";
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <div
        className="section halfImage"
        style={{ backgroundImage: `url(${background})` }}
      >
        <OverComponent
          // btn={"Shop"}
          link={"/shopping-cart"}
          heading={"Pantry"}
          subHeading={"Well Organized Pantry"}
        />
      </div>
      <div className="query-form">
        <div>
          <input
            type="text"
            placeholder="Search Recipe"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <button
            // type="button"
            className="input-btn btn"
            style={{ height: "45px", transform: "translate(0px, 3px)" }}
            onClick={(e) => e.preventDefault()}
          >
            Search
          </button>
        </div>
      </div>
      <br />
      <br />
      <div>
        {pantryItems && pantryItems.length > 2 ? (
          category.map((cat) => {
            return (
              getItem(cat) && (
                <>
                  <h2
                    className="heading blue"
                    style={{ paddingLeft: "7%", marginBottom: "0px" }}
                  >
                    {cat}
                  </h2>
                  <div
                    className={"recipies-list"}
                    // style={{ paddingLeft: "2%", paddingRight: "2%" }}
                  >
                    <br />
                    {getItem(cat)}
                  </div>
                </>
              )
            );
          })
        ) : (
          <div style={{ display: "flex" }}>
            <img src={emptyPantry} alt="No Items in Pantry" style={{ margin: "auto" }}>
              {/* <h2>No Items in Pantry</h2> */}
            </img>
          </div>
        )}
      </div>
    </>
  );
}

export default Pantry;
