import React, { useContext, useEffect, useState } from "react";
import { tokenContext, url, usernameContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import down from "../images/down.png";
import Modal from "react-modal";
import hide from "../images/hide.png";
import show from "../images/view.png";
import toast from "react-hot-toast";

function Navbar() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [type, setType] = useState("password");
  const [newType, setNewType] = useState("password");
  const { token, setToken } = useContext(tokenContext);
  const {username} = useContext(usernameContext)
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [changePasswordModalShow, setChangePasswordModalShow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const nav = useNavigate();

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

  const handleChangePassword = async () =>{
    setIsOpen(false);
    setChangePasswordModalShow(false);
    setNewType("password");
    setNewPassword("")

    fetch(`${url}/user/change-password/`,{
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword : password, newPassword }),
    } )
    .then(res => res.json())
    .then(data => {
      if(data.status === 'success')
        toast.success('Password Changes')
      else
        toast.error(data.msg)
    }).catch(Err => nav('/server-down'))
  }

  const handleDeleteUser = async () => {
    setIsOpen(false);
    setDeleteModalShow(false);
    setPassword('')
    setType("password");

    fetch(`${url}/user/`, {
      method: "delete",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "success") {
          //delete user
          setToken(null);
          localStorage.removeItem("token");
          setPassword("");
          nav("/login");
        } else {
          toast.error(data.msg);
        }
      })
      .catch((err) => nav("/server-down"));
  };

  return (
    <div className="navbar">
      <img
        src={logo}
        alt="PantryPal"
        className="logo"
        onClick={(e) => {
          nav("/");
        }}
      />
      <Modal
        isOpen={deleteModalShow}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={()=>{set}}
        style={customStyles}
        // contentLabel="Example Modal"
      >
        <>
          <h1 className="heading blue">
            Delete User
          </h1>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={type}
            className="input"
            name="password"
            required
            placeholder="Enter password"
          />
          <img
            src={type === "text" ? hide : show}
            className="eye"
            onClick={() => {
              setType(type === "text" ? "password" : "text");
            }}
          />
        </>
        <br />
        <button
          className="input-btn inlineClass"
          onClick={() => {
            setDeleteModalShow(false);
            setPassword("");
            setType("password");
          }}
        >
          Cancel
        </button>
        <button
          className="input-btn inlineClass"
          style={{ backgroundColor: "#FF6347" }}
          onClick={handleDeleteUser}
        >
          Delete
        </button>
      </Modal>
      <Modal
        isOpen={changePasswordModalShow}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={()=>{set}}
        style={customStyles}
        // contentLabel="Example Modal"
      >
        <>
          <h1 className="heading blue">
            Change Password
          </h1>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={type}
            className="input"
            name="password"
            required
            placeholder="Enter password"
          />
          <img
            src={type === "text" ? hide : show}
            className="eye"
            onClick={() => {
              setType(type === "text" ? "password" : "text");
            }}
          />
        </>
        <>
          <input
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            type={newType}
            className="input"
            name="password"
            required
            placeholder="Enter New Password"
          />
          <img
            src={newType === "text" ? hide : show}
            className="eye"
            onClick={() => {
              setNewType(newType === "text" ? "password" : "text");
            }}
          />
        </>
        <br />
        <button
          className="input-btn inlineClass"
          onClick={() => {
            setChangePasswordModalShow(false);
            setNewPassword("");
            setPassword("")
            setType("password")
            setNewType("password");
          }}
        >
          Cancel
        </button>
        <button
          className="input-btn inlineClass"
          style={{ backgroundColor: "#FF6347" }}
          onClick={handleChangePassword}
        >
          Change
        </button>
      </Modal>

      {token && (
        < span className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/pantry/">Pantry</Link>
          <Link to="/shopping-cart/">Shopping Cart</Link>
          <Link to="/recipe/">Recipies</Link>
          <Link to="/meal-plans/">Meal Plans</Link>
          <Link
            onClick={() => setIsOpen(!isOpen)}
            className="profile-dropdown"
            style={{ zIndex: "1" }}
          >
            {username}
            <img
              src={down}
              style={{ width: "15px", display: "inline-block" }}
            />
            <br />
            {isOpen && (
              <div
                className="dropdown"
              >
                {/* <br /> */}
                <Link
                  className="options"
                  onClick={() => setChangePasswordModalShow(true)}
                >
                  Change Password
                </Link><Link
                  className="options"
                  onClick={() => setDeleteModalShow(true)}
                >
                  Delete Account
                </Link>
                <Link
                  className="options"
                  to={"/login"}
                  onClick={(e) => {
                    setIsOpen(false);
                    localStorage.removeItem("token");
                    setToken(null);
                  }}
                >
                  Logout
                </Link>
              </div>
            )}
          </Link>
          {/* <svg class="CYXQR" width="24" height="24" viewBox="0 0 24 24" version="1.1" aria-hidden="false"><desc lang="en-US">navigation menu</desc><path d="M3 16h18v2H3v-2ZM3 6v2h18V6H3Zm0 7h18v-2H3v2Z"></path></svg> */}
        </ span>
      )}
    </div>
  );
}

export default Navbar;
