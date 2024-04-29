import React, { useContext, useState } from "react";
import AddItem from "./AddItem";
import { url, tokenContext, shoppingItemsContext } from "../App";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AddItemOverComponent({
  heading,
  subHeading,
  selectedItems,
  setSelectedItems,
}) {
  const [modalShow, setModalShow] = useState(false);
  const { token } = useContext(tokenContext);
  const nav = useNavigate();
  const { shoppingItems, setShoppingItems } = useContext(shoppingItemsContext);

  async function handleBuy() {
    if(selectedItems.length <= 2){
      return toast.error('Cart is empty')
    }

    JSON.parse(selectedItems).map(async (item, ix) => {
      fetch(`${url}/items/add-item-to-pantry/${item}/`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            var tempShoppingItems = JSON.parse(shoppingItems);
            for (var index = 0; index < tempShoppingItems.length; index++) {
              if (item == tempShoppingItems[index]._id) {
                tempShoppingItems.splice(index, index + 1);
                index--; 
              }
            }
            setShoppingItems(JSON.stringify(tempShoppingItems));
            setSelectedItems('[]')
            window.location.reload(false);
          } else throw new Error();
        })
        .catch((err) => {
          // console.log(err);
          nav("/server-down");
        });
      if (ix === JSON.parse(selectedItems).length - 1) {
        setSelectedItems("[]");
      }
      setTimeout(()=>{
        nav('/shopping-cart')
      }, 1000)
    });
  }

  return (
    <div className="page-form overSection">
      <h1 className="over-heading">{heading}</h1>
      <div className="bar"></div>
      <br />
      {subHeading && (
        <>
          <span className="over-sub-heading">{subHeading}</span>
          <br />
        </>
      )}
      <button
        className="input-btn btn inlineClass"
        onClick={() => {
          setModalShow(true);
        }}
      >
        Add Item
      </button>
      <button className="input-btn btn inlineClass" onClick={handleBuy}>
        Buy
      </button>
      <AddItem
        show={modalShow}
        closeModal={() => setModalShow(false)}
        setShoppingItems={setShoppingItems}
        shoppingItems={shoppingItems}
      />
    </div>
  );
}

export default AddItemOverComponent;
