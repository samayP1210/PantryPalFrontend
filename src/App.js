import React, { useState, createContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Components/Home";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import Recipe from "./Components/Recipe";
import AddRecipe from "./Components/AddRecipe";
import ServerDown from "./Components/ServerDown";
import NotFound from "./Components/NotFound";
import Pantry from "./Components/Pantry";
import ShoppingCart from "./Components/ShoppingCart";
import SingleRecipe from "./Components/SingleRecipe";
import MealPlans from "./Components/MealPlans";
import "./App.css";

import { Toaster } from "react-hot-toast";

export const tokenContext = createContext();
export const usernameContext = createContext();
export const userIdContext = createContext();
export const emailContext = createContext();
export const shoppingItemsContext = createContext();
// export const url = "http://localhost:5001/api";
export const url = "https://pantrypalbackend-ho6k.onrender.com/api";

function App() {
  const paths = [
    {
      path: "/login",
      elem: <Login />,
    },
    {
      path: "/register",
      elem: <Register />,
    },
    {
      path: "/",
      elem: <Home />,
    },
    {
      path: "/pantry",
      elem: <Pantry />,
    },
    {
      path: "/shopping-cart",
      elem: <ShoppingCart />,
    },
    {
      path: "/recipe",
      elem: <Recipe />,
    },
    {
      path: "/add-recipe",
      elem: <AddRecipe />,
    },
    {
      path: "/recipe/:userId/:_id",
      elem: <SingleRecipe />,
    },
    {
      path: "/server-down",
      elem: <ServerDown />,
    },
    {
      path: "/meal-plans",
      elem: <MealPlans />,
    },
    {
      path: "/*",
      elem: <NotFound />,
    },
  ];

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState();
  const [userId, setUserId] = useState();
  const [email, setEmail] = useState();
  const nav = useNavigate();
  const [shoppingItems, setShoppingItems] = useState("[]");

  useEffect(() => {
    if (token) {
      fetch(`${url}/user/`, {
        method: "get",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserId(data.userId);
          setEmail(data.email)
          setUsername(data.username)
          // console.log(data)
        })
        .catch((err) => nav("/login"));
    }

    if (!shoppingItems) {
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
    }
  }, []);

  return (
    <shoppingItemsContext.Provider value={{ shoppingItems, setShoppingItems }}>
      <usernameContext.Provider value={{ username, setUsername }}>
        <userIdContext.Provider value={{ userId, setUserId }}>
          <emailContext.Provider value={{ email, setEmail }}>
            <tokenContext.Provider value={{ token, setToken }}>
              <div className="App">
                <Navbar />
                <Toaster position="top-right" />

                <Routes>
                  {paths.map((path, ix) => (
                    <Route
                      exact
                      key={ix}
                      path={path.path}
                      element={path.elem}
                    />
                  ))}
                </Routes>
              </div>
            </tokenContext.Provider>
          </emailContext.Provider>
        </userIdContext.Provider>
      </usernameContext.Provider>
    </shoppingItemsContext.Provider>
  );
}

export default App;
