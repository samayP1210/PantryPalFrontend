import React, { useContext, useEffect, useState } from "react";
import { url, tokenContext } from "../App";
import OverComponent from "./OverComponent";
import MealCard from "./MealCard";
import { useNavigate } from "react-router-dom";

import background from "../images/mealBg.jpg"

function MealPlans() {
  const [pendingMeals, setPendingMeals] = useState("[]");
  const [otherMeals, setOtherMeals] = useState("[]");
  // const [seenDate, setSeenDate] = useState("[]");
  const { token } = useContext(tokenContext);
  const nav = useNavigate();

  function getDate(date) {
    if (
      new Date(date) < new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    ) {
      switch (new Date(date).getDay()) {
        case 0:
          return "Sunday";
        case 1:
          return "Monday";
        case 2:
          return "Tuesday";
        case 3:
          return "Wednesday";
        case 4:
          return "Thursday";
        case 5:
          return "Friday";
        default:
          return "Saturday";
      }
    } else {
      return new Date(date).toDateString().substring(4, 10);
    }
  }

  function getPendingMeals() {
    const a = [];

    JSON.parse(pendingMeals).map((meal, ix) => {
      if (new Date(meal.date) < new Date()) {
        pastDueDate(meal._id);
        window.location.reload(false);
        return <></>;
      }

      a.push(
        <MealCard
          key={ix}
          mealId={meal._id}
          date={new Date(meal.date)}
          status={"Pending"}
          meals={pendingMeals}
          setMeals={setPendingMeals}
          otherMeals={otherMeals}
          setOtherMeals={setOtherMeals}
          link={`/recipe/${meal.userId}/${meal.recipyId}/`}
          recipyId={meal.recipyId}
        />
      );
      // console.log(a);
    });
    return a;
  }

  useEffect(() => {
    if (!token) {
      nav("/login");
    }

    fetch(`${url}/meals/pending-meals/`, {
      method: "get",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "success")
          setPendingMeals(JSON.stringify(data.mealPlans));
        else nav("/*");
      })
      .catch((err) => nav("/server-down"));

    fetch(`${url}/meals/other-meals/`, {
      method: "get",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "success")
          setOtherMeals(JSON.stringify(data.mealPlans));
        else nav("/*");
      })
      .catch((err) => nav("/server-down"));
  }, []);

  function pastDueDate(mealId) {
    fetch(`${url}/meals/${mealId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "Missed" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data !== "success") nav("/*");
      })
      .catch((err) => {
        // console.log(err);
        nav("/server-down");
      });
  }

  return (
    <>
      <div
        className="section halfImage"
        style={{ backgroundImage: `url(${background})` }}
      >
        <OverComponent
          heading={"My Plans"}
          subHeading={"Effectively Manage Meal Plans"}
        />
      </div>

      <div>
        <h1
          className="heading blue"
          style={{
            paddingLeft: "7%",
            marginTop: "15px",
            marginBottom: "0px",
          }}
        >
          Upcoming Plans
        </h1>
        <div
          className={"recipies-list"}
          // style={{ paddingLeft: "2%", paddingRight: "2%" }}
        >
          <br />
          {pendingMeals.length > 2 ? (
            getPendingMeals()
          ) : (
            <div style={{ margin: "auto" }}>
              <h2>No Upcoming Plans</h2>
            </div>
          )}
        </div>
      </div>

      <div>
        <h1
          className="heading blue"
          style={{
            paddingLeft: "7%",
            marginTop: "15px",
            marginBottom: "0px",
          }}
        >
          History
        </h1>
        <div
          className={"recipies-list"}
          // style={{ paddingLeft: "2%", paddingRight: "2%" }}
        >
          <br />
          {otherMeals.length > 2 ? (
            JSON.parse(otherMeals).map((meal, ix) => {
              return (
                <MealCard
                  key={ix}
                  mealId={meal._id}
                  date={new Date(meal.date)}
                  status={meal.status}
                  meals={otherMeals}
                  setMeals={setOtherMeals}
                  recipyId={meal.recipyId}
                />
              );
            })
          ) : (
            <div style={{ margin: "auto" }}>
              <h2>No Plans made so far</h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MealPlans;
