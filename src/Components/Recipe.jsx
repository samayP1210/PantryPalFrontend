import React, { useContext, useEffect, useState } from "react";
import OverComponent from "./OverComponent";
import RecipeCard from "./RecipeCard";
import { useNavigate } from "react-router-dom";
import { tokenContext, url } from "../App";
import { Toaster } from "react-hot-toast";

function Recipies() {
  const { token } = useContext(tokenContext);
  const [query, setQuery] = useState("");
  const [recipies, setRecipies] = useState();
  const nav = useNavigate();

  useEffect(() => {
    if (!token) {
      nav("/login");
    }

    fetch(`${url}/recipies/` + (query ? `search-recipe/${query}` : ""), {
      method: "get",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRecipies(JSON.stringify(data.recipies));
      })
      .catch((err) => nav("/server-down"));
  }, [query]);

  return (
    <>
      <Toaster position="top-right" />
      <div className="section halfImage">
        <OverComponent
          btn={"Add Recipe"}
          link={"/add-recipe"}
          heading={"Our Recipies"}
          subHeading={"Get Recipies of world"}
        />
      </div>
      <div className="query-form">
        <form>
          <input
            type="text"
            placeholder="Search Recipe"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <button
            className="input-btn btn"
            onClick={(e) => e.preventDefault()}
            style={{ height: "45px", transform: "translate(0px, 3px)" }}
          >
            Search
          </button>
        </form>
        <br />
        <h2
          className="heading blue"
          style={{ fontSize: "21pt", textDecoration: "underline" }}
        >
          {query ? "Results" : "Top Recipies"}
        </h2>
      </div>
      <div className={"recipies-list"}>
        {recipies &&
          JSON.parse(recipies).map((r, ix) => {
            return (
              <RecipeCard
                key={ix}
                recipe={JSON.stringify(r)}
                recipies={recipies}
                setRecipies={setRecipies}
              />
            );
          })}
      </div>
    </>
  );
}

export default Recipies;
