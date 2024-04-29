import React, { useEffect, useState, useContext } from "react";
import hide from "../images/hide.png";
import show from "../images/view.png";
import { Link, useNavigate } from "react-router-dom";
import { tokenContext, url, userIdContext, usernameContext } from "../App";
import { Toaster, toast } from "react-hot-toast";

function Login() {
  const [type, setType] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { token, setToken } = useContext(tokenContext);
  const { setUserId } = useContext(userIdContext);
  const { setUsername } = useContext(usernameContext);
  const nav = useNavigate();

  useEffect(() => {
    if (token) nav("/");
  }, []);

  function handleLogin(e) {
    if (!email || !password) {
      return;
    }
    e.preventDefault();
    
    fetch(`${url}/user/login/`, {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ password, email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          setUserId(data.userId)
          setUsername(data.username.split(' ')[0])
          nav("/");
        } else {
          toast.error(data.msg);
        }
      })
      .catch(err => nav('/server-down'))
  }

  return (
    <div className="section">
      <Toaster position="top-right" />
      <form className="page-form">
        <h2 className="heading">User Login</h2>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="input"
          name="email"
          required
          placeholder="Enter email"
        />
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
        <button className="input-btn" onClick={handleLogin}>
          Login
        </button>

        <div style={{ fontSize: "14pt", textAlign: "center" }}>
          Not a user?{" "}
          <Link
            to={"/register"}
            style={{ color: "3B2D23", textDecoration: "none" }}
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
