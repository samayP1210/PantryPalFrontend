import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { url, tokenContext, shoppingItemsContext } from "../App";
import Modal from "react-modal";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function AddItem(props) {
  const [name, setName] = useState(props.name);
  const [quantity, setQuantity] = useState(props.neededQuantity);
  const [unit, setUnit] = useState("units");
  const [expiryDate, setExpireDate] = useState(
    dayjs(new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000))
  );
  const { shoppingItems, setShoppingItems } = useContext(shoppingItemsContext);
  const [category, setCategory] = useState("Sauces");
  const categories = ["Sauces", "Veggies", "Fruits", "Dairy", "Meat", "Spices", "Other"];

  const { token } = useContext(tokenContext);
  const nav = useNavigate();
  // name, quantity, unit, expiryDate, category
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      width: "40%",
      transform: "translate(-50%, -50%)",
      paddingTop: "45px",
    },
  };

  async function handleAddItemToShoppingCart() {
    fetch(`${url}/items/add-item-to-shopping`, {
      method: "Post",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, quantity, unit, expiryDate, category }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          toast.success("Item Added");
          props.closeModal();
          const tempShoppingItems = JSON.parse(shoppingItems);
          tempShoppingItems.push(data.shoppingItem);
          setShoppingItems(JSON.stringify(tempShoppingItems));
          nav("/shopping-cart");
        } else toast.error(data.msg);
      })
      .catch((err) => {
        // console.log(err);
        nav("/server-down");
      });
  }

  return (
    <Modal
      isOpen={props.show}
      // onAfterOpen={afterOpenModal}
      // onRequestClose={props.closeModal}
      style={customStyles}
      // contentLabel="Example Modal"
    >
      <h2 className="heading blue" style={{ paddingLeft: "4%" }}>
        Add Item
      </h2>
      <>
        <h4 htmlFor="" className="heading addItem">
          Name
        </h4>
        <input
          type="text"
          className="input addItem"
          style={{ width: "66%", marginLeft: "8%" }}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </>
      <>
        <h4 htmlFor="" className="heading addItem">
          Quantity
        </h4>
        <input
          type="number"
          min={1}
          className="input addItem"
          // style={{ width: "70%" }}
          onChange={(e) => setQuantity(e.target.value)}
          value={quantity}
          placeholder="Quantity"
          style={{ width: "24%" }}
        />
      </>
      <>
        <h4 htmlFor="" className="heading addItem">
          Unit
        </h4>
        <input
          type="text"
          // min = {0}
          className="input addItem"
          onChange={(e) => setUnit(e.target.value)}
          value={unit}
          style={{ width: "24%" }}
        />
      </>
      <div>
        <h4 htmlFor="" className="heading addItem">
          Category
        </h4>
        <select
          className="input addItem"
          style={{ width: "71%", marginLeft: "3.5%" }}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        >
          {categories.map((c) => (
            <option value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4
          className="heading addItem"
          style={{ transform: "translateY(17px)" }}
        >
          Expiry
        </h4>
        <div
          style={{ marginLeft: "7.5%", width: "38%", display: "inline-block" }}
        >
          <DatePicker
            disablePast
            className="input"
            value={expiryDate}
            onChange={(newValue) => setExpireDate(newValue)}
            format="DD-MMM-YYYY"
          />
        </div>
      </div>
      <button className="input-btn inlineClass" onClick={props.closeModal}>
        Cancel
      </button>
      <button
        className="input-btn inlineClass"
        onClick={handleAddItemToShoppingCart}
      >
        Add
      </button>
    </Modal>
  );
}
