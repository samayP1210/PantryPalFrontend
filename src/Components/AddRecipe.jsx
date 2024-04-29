import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { tokenContext, url } from "../App";
import background from "../images/addRecipeBg.jpg";
import Modal from "react-modal";

import { Toaster, toast } from "react-hot-toast";
import IngredientCard from "./IngredientCard";

function BookRoom() {
  const [featured, setFeatured] = useState(false);
  const [recipyName, setRecipyName] = useState("");
  const [servings, setServings] = useState(1);
  const [recipeModalShow, setRecipeModalShow] = useState(false);
  const [cuisine, setCuisine] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState("[]");
  const [name, setName] = useState();
  const [quantity, setQuantity] = useState();
  const [unit, setUnit] = useState();

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

  const { token } = useContext(tokenContext);
  const nav = useNavigate();
  useEffect(() => {
    if (!token) {
      nav("/login");
      return;
    }
  }, []);

  async function handleClick(e) {
    fetch(`${url}/recipies/`, {
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        recipyName,
        description,
        featured,
        instructions,
        ingredients: JSON.parse(ingredients),
        servings,
        cuisine,
      }),
    })
      .then((res) => res.json())
      .then((recipe) => {
        if (recipe.status === "success") {
          toast.success("Recipe Added");
          nav("/recipe");
        } else {
          toast.error(recipe.msg);
        }
      })
      .catch((err) => nav("/server-down"));
  }

  function handleAddIngredient() {
    setName("");
    setQuantity("");
    setUnit("");

    var tempIngredients = JSON.parse(ingredients);
    tempIngredients.push({ name, quantity, unit });
    setIngredients(JSON.stringify(tempIngredients));
    setRecipeModalShow(false);
  }

  return (
    <div
      className="section"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <Modal
        isOpen={recipeModalShow}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={props.closeModal}
        style={customStyles}
        // contentLabel="Example Modal"
      >
        <h2 className="heading blue">
          Add Ingredient
        </h2>
        <h3 htmlFor="" className="heading addItem">
          Name
        </h3>
        <input
          type="text"
          className="input addItem"
          style={{ width: "66%", marginLeft: "8%" }}
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder={"Enter Ingredient Name"}
        />
        <>
          <h3 htmlFor="" className="heading addItem">
            Quantity
          </h3>
          <input
            type="number"
            min={1}
            className="input addItem"
            // style={{ width: "70%" }}
            onChange={(e) => setQuantity(e.target.value)}
            value={quantity}
            style={{ width: "24%" }}
            placeholder={"Quantity"}
          />
        </>
        <>
          <h3 htmlFor="" className="heading addItem">
            Unit
          </h3>
          <input
            type="text"
            // min = {0}
            className="input addItem"
            onChange={(e) => setUnit(e.target.value)}
            value={unit}
            style={{ width: "22%" }}
            placeholder={"Unit"}
          />
        </>
        <button
          className="input-btn inlineClass"
          onClick={() => {
            setRecipeModalShow(false);
            setName("");
            setQuantity("");
            setUnit("");
          }}
        >
          Cancel
        </button>
        <button className="input-btn inlineClass" onClick={handleAddIngredient}>
          Add
        </button>
      </Modal>
      <Toaster position="top-right" />
      <div
        className="page-form"
        style={{ width: "90%", transform: "translateY(3vh)" }}
      >
        <h1 className="heading" style={{ marginBottom: "-5px" }}>
          Add Recipe
        </h1>
        <div className="bar" style={{ display: "block" }}></div>
        <div className="left-section">
          <br />
          <>
            <label htmlFor="name" className="heading">
              Recipe Name
            </label>
            <input
              type="text"
              className="input"
              required
              placeholder="Enter recipe name"
              onChange={(e) => setRecipyName(e.target.value)}
              value={recipyName}
            />
          </>
          <div className="inlineClass">
            <label htmlFor="servings" className="heading">
              Servings
            </label>
            <input
              type="number"
              className="input"
              required
              min={1}
              placeholder="Enter recipe servings"
              onChange={(e) => setServings(e.target.value)}
              value={servings}
            />
          </div>
          <div className="inlineClass" style={{ marginRight: "0px" }}>
            <label htmlFor="cuisine" className="heading">
              Cuisine
            </label>
            <input
              type="text"
              className="input"
              required
              placeholder="Enter cuisine"
              onChange={(e) => setCuisine(e.target.value)}
              value={cuisine}
            />
          </div>

          <br />
          <>
            <label
              htmlFor="ingredients"
              className="heading"
              style={{ marginBottom: "10px" }}
            >
              {" "}
              Ingredients
            </label>
            <div className="ingredients">
              {/* <IngredientCard name = {'Kiwi'} requiredQuantity={32} unit={'kg'}/> */}
              <div>
                {JSON.parse(ingredients).map((ingredient) => {
                  return (
                    <div style={{ marginLeft: "1%" }}>
                      <IngredientCard
                        name={ingredient.name}
                        requiredQuantity={ingredient.quantity}
                        unit={ingredient.unit}
                        addRecipe={true}
                        ingredients={ingredients}
                        setIngredients={setIngredients}
                      />
                    </div>
                  );
                })}

                {/* <div style={{ marginLeft: "1%" }}>
                  <IngredientCard
                    name={"Ing"}
                    requiredQuantity={43}
                    unit={"gm"}
                    addRecipe={true}
                  />
                </div>
                <div style={{ marginLeft: "1%" }}>
                  <IngredientCard
                    name={"Water"}
                    requiredQuantity={43}
                    unit={"gm"}
                    addRecipe={true}
                  />
                </div> */}
              </div>
            </div>
            <button
              className="input-btn ingredient-btn"
              onClick={() => {
                setRecipeModalShow(true);
              }}
            >
              Add Ingredient
            </button>
          </>

          {/* <>
            <img alt="No Image" src={image} className="choosenImg" />{" "}
            {image && (
              <img
                src={cross}
                className="cross"
                onClick={() => {
                  setImage(null);
                }}
              />
            )}
            <input
              type="file"
              onChange={onImageChange}
              style={
                image
                  ? { transform: "translate(15px, -20px)" }
                  : { transform: "translate(15px, 0px)" }
              }
            />
          </> */}
          <button
            className="input-btn"
            onClick={(e) => {
              setFeatured(!featured);
            }}
            style={
              featured
                ? {}
                : {
                    backgroundColor: "transparent",
                    border: "solid 2px #ffa500",
                  }
            }
          >
            {!featured ? "Add To Favourites" : "Favourite"}
          </button>
        </div>
        <div className="right-section">
          <div style={{ position: "relative" }}>
            <label htmlFor="description" className="heading">
              {" "}
              Description
            </label>
            (min 40 words)
            <textarea
              type="textarea"
              placeholder="Description..."
              name="description"
              className="input desc"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <div
              className={description.length < 40 ? "red" : "green"}
              style={{ position: "absolute", bottom: "11px", right: "7px" }}
            >
              {description.length} Words
            </div>
          </div>
          <>
            <label htmlFor="instructions" className="heading">
              {" "}
              Instructions
            </label>
            <textarea
              type="textarea"
              placeholder="Instructions..."
              name="instructions"
              className="input desc instruction"
              onChange={(e) => {
                setInstructions(e.target.value);
              }}
            />
          </>
          <button className="input-btn" onClick={handleClick}>
            Add Recipe
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookRoom;
