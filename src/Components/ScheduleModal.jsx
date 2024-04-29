import React, { useContext, useState } from "react";
import Modal from "react-modal";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";
import dayjs from "dayjs";
import { url, tokenContext } from "../App";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function ScheduleModal({ modalShow, setModalShow, recipe }) {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      width: "30%",
      transform: "translate(-50%, -50%)",
      paddingTop: "15px",
    },
  };

  const recipeObj = JSON.parse(recipe);
  const nav = useNavigate();
  const { token } = useContext(tokenContext);

  const [date, setDate] = useState(dayjs(new Date()));
  const [next, setNext] = useState(false);
  const [notifyMe, setNotifyMe] = useState(false);

  async function handleScheduleRecipe() {
    // console.log({ notifyMe });
    fetch(`${url}/meals/`, {
      method: "post",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        recipyId: recipeObj._id,
        date,
        notifyMe,
        recipyName: recipeObj.recipyName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setModalShow(false);
          setDate(dayjs(new Date()));
          setNext(false);
          toast.success("Recipe Scheduled");
          nav("/meal-plans");
        } else {
          toast.error(data.msg);
        }
      })
      .catch((err) => nav("/server-down"));
  }

  return (
    <Modal
      isOpen={modalShow}
      // onAfterOpen={afterOpenModal}
      // onRequestClose={()=>{set}}
      style={customStyles}
      // contentLabel="Example Modal"
    >
      {!next && (
        <>
          <h2 className="heading blue">Pick Date</h2>
          <DateCalendar
            disablePast
            value={date}
            onChange={(newValue) => {
              setDate(newValue);
              setNext(true);
            }}
          />
          <div>
            <span
              style={{ fontSize: "12pt", marginLeft: "62px", marginTop: "2px" }}
            >
              Notify Me
            </span>
            <label class="switch" style={{ transform: "translate(7px, -1px)" }}>
              <input
                type="checkbox"
                class="inp"
                onChange={() => {
                  // console.log({ notifyMe });
                  setNotifyMe(!notifyMe);
                }}
              />
              <span class="slider round"></span>
            </label>
          </div>
          <div>
            <button
              className="input-btn inlineClass"
              onClick={() => {
                setModalShow(false);
                setNext(false);
                setDate(dayjs(new Date()));
                setNotifyMe(false);
              }}
            >
              Cancel
            </button>
            <button
              className="input-btn inlineClass green-background"
              onClick={() => setNext(true)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {next && (
        <>
          <h2 className="heading blue">Pick Time</h2>
          {new Date(date).toDateString() === new Date().toDateString() ? (
            <TimeClock
              disablePast
              ampmInClock
              value={date}
              onChange={(newValue) => {
                setDate(newValue);
                setNext(true);
              }}
            />
          ) : (
            <TimeClock
              ampmInClock
              value={date}
              onChange={(newValue) => {
                setDate(newValue);
                setNext(true);
              }}
            />
          )}
          <br />
          <br />
          <button
            className="input-btn inlineClass"
            onClick={() => {
              setNext(false);
            }}
          >
            Back
          </button>
          <button
            className="input-btn inlineClass green-background"
            onClick={handleScheduleRecipe}
          >
            Schedule
          </button>
        </>
      )}
    </Modal>
  );
}

export default ScheduleModal;
