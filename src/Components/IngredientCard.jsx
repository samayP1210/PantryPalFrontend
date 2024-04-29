import React, { useContext, useEffect, useState } from "react";
import { url, tokenContext } from "../App";
import { useNavigate } from "react-router-dom";
import AddItem from "./AddItem";

function IngredientCard({
  name,
  requiredQuantity,
  unit,
  addRecipe,
  ingredients,
  setIngredients,
}) {
  const [color, setColor] = useState();
  const [sufficientIngredient, setSufficientIngredient] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [neededQuantity, setNeededQuantity] = useState(requiredQuantity);
  const { token } = useContext(tokenContext);
  const nav = useNavigate();

  function getColor(code) {
    if (code == 0 || code == 1) return "rgb(255 112 112 / 60%)";
    return "rgb(42 203 42 / 60%)"; // availble
  }

  function checkAvailability(date, ingredientQuantity, requiredQuantity) {
    if (new Date() > date) {
      return 0;
    } else if (ingredientQuantity < requiredQuantity) {
      return 1;
    }
    setSufficientIngredient(true);
    return 2;
  }

  useEffect(() => {
    // here
    fetch(`${url}/items/pantry-items/${name}`, {
      method: "post",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ partial: false }),
    })
      .then((res) => res.json())
      .then((ingredient) => {
        // console.log(ingredient);
        if (ingredient.status === "success" && ingredient.count !== 0) {
          setColor(
            getColor(
              checkAvailability(
                new Date(ingredient.pantryItems[0].expiryDate),
                ingredient.pantryItems[0].quantity,
                requiredQuantity
              )
            )
          );
        } else {
          setColor(
            getColor(checkAvailability(new Date(), 0, requiredQuantity))
          );
        }
      })
      .catch((err) => {
        // console.log(err);
        nav("/server-down");
      });
  }, []);

  return (
    <div>
      <div
        className="input-btn inlineIngredientClass"
        style={{ backgroundColor: color }}
      >
        <span>
          {name}{" "}
          <b>
            {" "}
            | (<>{requiredQuantity !== 0 ? requiredQuantity : ""} </>
            {unit})
          </b>
        </span>
        {!sufficientIngredient && !addRecipe && (
          <>
            <button
              className="input-btn buy"
              onClick={() => setModalShow(true)}
            >
              Add To Cart
            </button>
            <AddItem
              show={modalShow}
              closeModal={() => setModalShow(false)}
              name={name}
              // setShoppingItems={setShoppingItems}
              // shoppingItems={shoppingItems}
              neededQuantity={neededQuantity}
            />
          </>
        )}
        {addRecipe && (
          <>
            <button
              className="input-btn buy"
              style={{ backgroundColor: "#FF6347" }}
              onClick={() => {
                var tempIngredients = JSON.parse(ingredients);
                tempIngredients.map((i, ix) => {
                  if (i.name == name) {
                    tempIngredients.splice(ix, ix + 1);
                  }
                });

                setIngredients(JSON.stringify(tempIngredients));
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default IngredientCard;
