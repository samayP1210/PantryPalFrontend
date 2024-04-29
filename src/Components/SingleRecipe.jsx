import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { url, tokenContext } from "../App";
import IngredientCard from "./IngredientCard";
import { toast, Toaster } from "react-hot-toast";
import ScheduleModal from "./ScheduleModal";

function SingleRecipe() {
  const [recipe, setRecipe] = useState();
  const [modalShow, setModalShow] = useState(false);
  const { _id, userId } = useParams();
  const { token } = useContext(tokenContext);

  const nav = useNavigate();

  const color = "#2c3e50";

  useEffect(() => {
    if (!token) return nav("/login");

    fetch(`${url}/recipies/${_id}`, {
      method: "get",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.status === "success") {
          setRecipe(JSON.stringify(data.recipe));
          // console.log(data.recipe);
        } else {
          nav("/*");
        }
      })
      .catch((err) => nav("/server-down"));
  }, []);

  async function handleDeleteRecipe() {
    if (JSON.parse(recipe).userId !== userId) {
      return toast.error("Unauthorized Access");
    }
    // console.log(recipe._id, token);
    fetch(`${url}/recipies/${JSON.parse(recipe)._id}/`, {
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
          nav("/recipe");
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
    <>
      {recipe && (
        <div
          className="section"
          style={{
            backgroundImage: `url(${JSON.parse(recipe).imageUrl})`,
            height: "100%",
          }}
        >
          <Toaster position="top-right" />
          <ScheduleModal
            modalShow={modalShow}
            setModalShow={setModalShow}
            recipe={recipe}
          />
          <div
            className="page-form"
            style={{
              width: "60%",
              transform: "translateY(3vh)",
              fontSize: "14pt",
            }}
          >
            <h1 className="heading" style={{ color, display: "inline-block" }}>
              {JSON.parse(recipe).recipyName + " "}
            </h1>
            <div>
              {JSON.parse(recipe).servings} serving
              {JSON.parse(recipe).servings === 1 ? "" : "s"} |{" "}
              {JSON.parse(recipe).cuisine}
            </div>
            <div>
              <b className="heading">Description: </b>
              {JSON.parse(recipe).description}
            </div>
            <br />
            <h3 className="heading">Ingredients</h3>
            <div>
              {JSON.parse(recipe).ingredients.map((ingredient, ix) => (
                <IngredientCard
                  key={ix}
                  name={ingredient.name}
                  requiredQuantity={ingredient.quantity}
                  unit={ingredient.unit}
                  addRecipe={false}
                />
              ))}
            </div>
            <h3 className="heading">
              <b>Instructions</b>
            </h3>
            <div>{JSON.parse(recipe).instructions}</div>
            <button
              className="input-btn inlineClass"
              style={
                userId !== JSON.parse(recipe).userId
                  ? {
                      bottom: "0px",
                      backgroundColor: "#ffa494",
                      cursor: "not-allowed",
                    }
                  : { backgroundColor: "#FF6347" }
              }
              onClick={handleDeleteRecipe}
            >
              Delete
            </button>
            <button
              className="input-btn inlineClass"
              onClick={() => setModalShow(true)}
            >
              Schedule
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SingleRecipe;
