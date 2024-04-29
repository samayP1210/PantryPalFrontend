import React, { useState, useEffect, useContext } from "react";
import hide from "../images/hide.png";
import show from "../images/view.png";
import { tokenContext, url, userIdContext, usernameContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Register() {
  const [type, setType] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { token, setToken } = useContext(tokenContext);
  const { setUserId } = useContext(userIdContext);
  const { username, setUserName } = useContext(usernameContext);

  const nav = useNavigate();

  useEffect(() => {
    if (token) nav("/");
  }, []);

  function handleRegister(e) {
    if (!username || !email || !password) {
      return;
    }
    e.preventDefault();
    fetch(`${url}/user/register`, {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ password, email, username }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          setUserId(data.userId);
          nav("/");
        } else {
          toast.error(data.msg);
        }
      })
      .catch((err) => nav("/server-down"));
  }

  return (
    <div className="section">
      <Toaster position="top-right" />
      <form className="page-form">
        <h2 className="heading">User Register</h2>
        <input
          type="text"
          className="input"
          username="username"
          required
          placeholder="Enter username"
          onChange={(e) => setUserName(e.target.value)}
          value={username}
        />
        <input
          type="email"
          className="input"
          username="email"
          required
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type={type}
          className="input"
          username="password"
          required
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <img
          src={type === "text" ? hide : show}
          className="eye"
          onClick={() => {
            setType(type === "text" ? "password" : "text");
          }}
        />
        <button className="input-btn" onClick={handleRegister}>
          Register
        </button>
        <div style={{ fontSize: "14pt", textAlign: "center" }}>
          Already a user?{" "}
          <Link
            to={"/login"}
            style={{ color: "3B2D23", textDecoration: "none" }}
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
