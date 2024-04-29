import React, { useEffect, useContext, useState } from "react";
import { tokenContext, url } from "../App";
import RecipeCard from "./RecipeCard";
import { useNavigate } from "react-router-dom";

function Featured() {
  const { token } = useContext(tokenContext);
  const [recipies, setRecipies] = useState();
  const nav = useNavigate();

  useEffect(() => {
    fetch(`${url}/recipies/featured/`, {
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((recipies) => {
        setRecipies(JSON.stringify(recipies.recipies));
      })
      .catch((err) => nav("/server-down"));
  }, []);

  return (
    <div className="featured">
      <h2 className="over-heading">Favourite Recipies</h2>
      <div className="bar"></div>
      <br />
      <br />
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
        {recipies &&
          (recipies.length === 2 ? (
            <div style={{ margin: "auto" }}>
              <h2>No Favourite Recipies</h2>
            </div>
          ) : (
            <></>
          ))}
      </div>
    </div>
  );
}

export default Featured;
