import img from "../images/recipeBg.jpg";
import dlt from "../images/delete.png";
import done from "../images/done.png";
import clock from "../images/clock.png";
import "react-clock/dist/Clock.css";
import { url, tokenContext } from "../App";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function MealCard({
  date,
  mealId,
  link,
  status,
  meals,
  setMeals,
  otherMeals,
  setOtherMeals,
  recipyId,
}) {
  const timeString = date.toLocaleTimeString();
  const [temp, setTemp] = useState();
  const { token } = useContext(tokenContext);
  const [name, setName] = useState();
  const [cuisine, setCuisine] = useState();
  const [servings, setServings] = useState();
  const [imageUrl, setImageUrl] = useState();
  const nav = useNavigate();

  useEffect(() => {
    fetch(`${url}/recipies/${recipyId}`, {
      method: "get",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data.status === "success") {
          setName(data.recipe.recipyName);
          setCuisine(data.recipe.cuisine);
          setServings(data.recipe.servings);
          setImageUrl(data.recipe.imageUrl);
        } else nav("/*");
      })
      .catch((err) => {
        // console.log(err);
        nav("/server-down");
      });
  }, []);

  function getDate(date) {
    if (new Date(date).toDateString() === new Date().toDateString()) {
      return "Today";
    } else if (
      new Date(date) < new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    ) {
      switch (new Date(date).getDay()) {
        case 0:
          return "Sun";
        case 1:
          return "Mon";
        case 2:
          return "Tue";
        case 3:
          return "Wed";
        case 4:
          return "Thur";
        case 5:
          return "Fri";
        default:
          return "Sat";
      }
    } else {
      return new Date(date).toDateString().substring(4, 10);
    }
  }

  function deleteFromList() {
    const tempMeals = JSON.parse(meals);
    tempMeals.map((meal, ix) => {
      if (mealId === meal._id) {
        setTemp(JSON.stringify(meal));
        tempMeals.splice(ix, ix + 1);
      }
    });
    setMeals(JSON.stringify(tempMeals));
    return new Promise((res, rej) => res(""));
  }

  async function handleCompleted() {
    deleteFromList()
      .then((x) =>
        fetch(`${url}/meals/${mealId}`, {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Completed" }),
        })
      )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const tempMeals = JSON.parse(otherMeals);
          tempMeals.push(temp);
          setOtherMeals(JSON.stringify(tempMeals));

          window.location.reload(false);
        } else {
          nav("/*");
        }
      })
      .catch((err) => nav("/server-down"));
    // if(temp){

    // }
  }

  async function handleDelete() {
    fetch(`${url}/meals/${mealId}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          toast.success("Plan Deleted");
          deleteFromList();
        } else {
          toast.error("Cannot Delete");
        }
      })
      .catch((err) => {
        // console.log(err);
        nav("/server-down");
      });
  }

  function getColor() {
    switch (status) {
      case "Completed":
        return " available";
      case "Missed":
        return " not-available";
      default:
        return "";
    }
  }
  // console.log(status);
  return (
    <div
      className={"recipy-card-container" + getColor()}
      style={{ width: "520px", marginRight: "2%" }}
    >
      <img
        src={imageUrl}
        className="recipy-logo"
        style={{ height: "90px", width: "120px" }}
      />
      <div className="recipy-details" style={{ width: "45%" }}>
        {name && <h3 className="blue">{name}</h3>}
        {cuisine && (
          <span>
            {cuisine} | {servings} Servings
          </span>
        )}
      </div>

      <div className="blue time">
        <span
          className={
            getDate(date) === "Today" && status === "Pending" ? "red" : ""
          }
        >
          {getDate(date)}
        </span>
        <br />
        {timeString.substring(0, timeString.length - 6) +
          " " +
          timeString.substring(timeString.length - 2)}
      </div>

      <div className="meal-btns">
        {status === "Pending" && (
          <>
            <button>
              <img
                onClick={handleCompleted}
                src={done}
                className="green-background meal-action-btn"
              />
            </button>

            <button>
              <img
                src={clock}
                onClick={() => nav(link)}
                className="yellow-background meal-action-btn"
              />
            </button>
          </>
        )}
        <button>
          <img
            src={dlt}
            onClick={handleDelete}
            className="red-background meal-action-btn"
          />
        </button>
      </div>
    </div>
  );
}

export default MealCard;
