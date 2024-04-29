import React, { useContext, useEffect, useState } from "react";
import AddItemOverComponent from "./AddItemOverComponent";
import ItemCard from "./ItemCard";
import { useNavigate } from "react-router-dom";
import { tokenContext, url, shoppingItemsContext } from "../App";
import background from "../images/shoppingBg.jpg";
import { Toaster } from "react-hot-toast";
import emptyCart from "../images/emptyCart.png";

function ShoppingCart() {
  const { token } = useContext(tokenContext);
  const { shoppingItems, setShoppingItems } = useContext(shoppingItemsContext);
  const nav = useNavigate();
  const [selectedItems, setSelectedItems] = useState("[]");
  const category = [
    "Sauces",
    "Veggies",
    "Fruits",
    "Meat",
    "Spices",
    "Dairy",
    "Other",
  ];

  useEffect(() => {
    if (!token) {
      nav("/login");
    }

    fetch(
      `${url}/items/shopping-items/`,
      // (query ? `${query}` : "")
      {
        method: "get",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setShoppingItems(JSON.stringify(data.shoppingItems));
        // console.log(data.shoppingItems);
      })
      .catch((err) => nav("/server-down"));
  }, []);

  function getItem(cat) {
    var items = [];
    {
      shoppingItems &&
        JSON.parse(shoppingItems).map((item) => {
          // console.log(shoppingItems)
          if (item.category === cat)
            items.push(
              <ItemCard
                item={JSON.stringify(item)}
                color={getColor(cat)}
                pantryItems={shoppingItems}
                setPantryItems={setShoppingItems}
                buy={true}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
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
        <AddItemOverComponent
          // btn={"Shop"}
          heading={"ShoppingCart"}
          subHeading={"Well Organized ShoppingCart"}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      </div>

      <br />
      <br />

      {shoppingItems.length > 2 ? (
        <div>
          {category.map((cat) => {
            return (
              getItem(cat) && (
                <>
                  <h2
                    className="heading blue"
                    style={{
                      paddingLeft: "7%",
                      marginBottom: "0px",
                    }}
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
          })}
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <img src={emptyCart} alt="No Items in Cart" style={{ margin: "auto" }}/>
          {/* <div style={{ margin: "auto" }}>
            <h2>No Items in Cart</h2>
          </div> */}
        </div>
      )}
    </>
  );
}

export default ShoppingCart;
