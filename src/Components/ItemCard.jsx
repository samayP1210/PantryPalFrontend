import { React, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { url, tokenContext } from "../App";
import background from "../images/defaultIngredient.jpg";
import { toast } from "react-hot-toast";
export default function ItemCard({
  item,
  color,
  pantryItems,
  setPantryItems,
  buy,
  selectedItems,
  setSelectedItems,
}) {
  // item is object
  const nav = useNavigate();
  const { token } = useContext(tokenContext);
  item = JSON.parse(item);
  const [isSelected, setIsSelected] = useState(false);
  // console.log(item.expiryDate.slice(0, 10))

  function checkExpiration(date) {
    if (new Date() > new Date(date)) return -1; // expired
    else if (new Date(date) - new Date() > 2 * 24 * 60 * 60 * 1000) return 1; // about to expire
    return 0; // far expiration
  }

  async function handleSelect() {
    var tempSelectedItems = JSON.parse(selectedItems);
    if (!isSelected) tempSelectedItems.push(item._id);
    else {
      tempSelectedItems.map((selectedItem, ix) => {
        if (selectedItem === item._id) tempSelectedItems.splice(ix, ix + 1);
      });
    }
    setSelectedItems(JSON.stringify(tempSelectedItems));
    setIsSelected(!isSelected);
  }

  async function handleDelete() {
    fetch(`${url}/items/remove-item/${item._id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data.status === "success") {
          toast.success("Item Deleted");
          const tempPantryItems = JSON.parse(pantryItems);
          tempPantryItems.map((i, ix) => {
            if (item._id === i._id) tempPantryItems.splice(ix, ix + 1);
          });
          setPantryItems(JSON.stringify(tempPantryItems));
        } else {
          toast.error("Cannot Delete");
        }
      })
      .catch((err) => {
        // console.log(err);
        nav("/server-down");
      });
  }

  return (
    <div
      className="recipy-card-container item-card-container"
      style={{ backgroundColor: color }}
    >
      <img
        src={item.imageUrl ? item.imageUrl : { background }}
        className="recipy-logo"
      />
      <div
        className="recipy-details"
        style={{ paddingTop: "0px", width: "90%" }}
      >
        <h2 className="blue">{item.name}</h2>
        <span>
          <h4 style={{ display: "inline-block" }}>{`Quantity:`} </h4>
          {" " + item.quantity + " " + item.unit}
        </span>
        <br />
        <h4 style={{ display: "inline-block" }}>{`Purchased: `} </h4>
        {" " + item.purchaseDate.slice(0, 10)}
        <br /> <h4 style={{ display: "inline-block" }}>{`Expiration:`} </h4>
        {" " + item.expiryDate.slice(0, 10)}
        <div
          className="expirationLabel"
          style={{
            backgroundColor:
              checkExpiration(item.expiryDate) < 0
                ? "#FF0000"
                : checkExpiration(item.expiryDate) == 0
                ? "#FFA500"
                : "#008000",
          }}
          // onMouseOver={}
        ></div>
        <button
          className={buy ? "input-btn inlineClass" : "input-btn"}
          style={{ backgroundColor: "#FF6347", border: "solid 2px white" }}
          onClick={handleDelete}
        >
          Delete
        </button>
        {buy && (
          <button
            className="input-btn inlineClass"
            style={
              !isSelected
                ? { border: "solid 2px white" }
                : {
                    backgroundColor: "transparent",
                    border: "2px solid white",
                  }
            }
            onClick={handleSelect}
          >
            {" "}
            {!isSelected ? "Select" : "Cancel"}
          </button>
        )}
      </div>
    </div>
  );
}
