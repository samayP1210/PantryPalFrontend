import { React, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { url, tokenContext, userIdContext } from "../App";
import { toast } from "react-hot-toast";

export default function RecipyCard({ recipe, recipies, setRecipies }) {
  // recipe is object
  const nav = useNavigate();
  // const [userId, setUserId] = useState()
  const { token } = useContext(tokenContext);
  const { userId } = useContext(userIdContext);
  recipe = JSON.parse(recipe);

  async function handleDeleteRecipe() {
    if (recipe.userId !== userId) {
      return toast.error("Unauthorized Access");
    }
    // console.log(recipe._id, token);
    fetch(`${url}/recipies/${recipe._id}/`, {
      method: "delete",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data.status === "success") {
          toast.success("Recipe Deleted");
          const tempRecipies = JSON.parse(recipies);
          tempRecipies.map((r, ix) => {
            if (r._id === recipe._id) tempRecipies.splice(ix, ix + 1);
          });
          setRecipies(JSON.stringify(tempRecipies));
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
    <div className="recipy-card-container">
      <img src={recipe.imageUrl} className="recipy-logo" />
      <div className="recipy-details">
        <h3 className="blue">{recipe.recipyName}</h3>
        <span>
          {recipe.cuisine} | {recipe.servings} Servings
        </span>
        {/* <br /> */}
        <br />(
        {recipe.description.length <= 40
          ? recipe.description
          : recipe.description.slice(0, 40) + "..."}
        )
        <br />
        <br />
        <button
          className="input-btn inlineClass"
          onClick={() => {
            nav("/recipe/"  + userId +"/" + recipe._id);
          }}
          style={{ bottom: "0px" }}
        >
          {" "}
          View Recipy
        </button>
        <button
          className="input-btn inlineClass"
          onClick={handleDeleteRecipe}
          style={
            userId && userId !== recipe.userId
              ? {
                  bottom: "0px",
                  backgroundColor: "#ffa494",
                  cursor: "not-allowed",
                }
              : { backgroundColor: "#FF6347" }
          }
        >
          {/* {console.log(userId, recipe.userId)} */}
          Delete
        </button>
      </div>
    </div>
  );
}
