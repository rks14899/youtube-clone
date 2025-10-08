import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid rgba(180, 180, 180, 0.6); /* ✅ visible border */
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 400px;
  max-width: 90%;
  gap: 12px;

  @media (max-width: 480px) {
    width: 90%;
    padding: 20px;
    border-radius: 10px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 5px;
`;

const Subtitle = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-bottom: 20px;
`;

const Input = styled.input`
  border: 1px solid rgba(180, 180, 180, 0.8);
  color: ${({ theme }) => theme.text};
  border-radius: 6px;
  padding: 10px;
  width: 100%;
  background-color: ${({ theme }) => theme.bg};
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #3ea6ff;
    outline: none;
  }

  &::placeholder {
    color: #999;
  }

  @media (max-width: 480px) {
    padding: 8px;
    font-size: 13px;
  }
`;

const Button = styled.button`
  border: none;
  border-radius: 6px;
  padding: 8px 0;
  background-color: #065fd4;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  transition: background 0.25s ease;

  &:hover {
    background-color: #0049a8;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 7px 0;
  }
`;

const GoogleButton = styled(Button)`
  background-color: #3ea6ff;
  &:hover {
    background-color: #2d94ea;
  }
`;

const Line = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.textSoft};
  font-size: 13px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
  margin-top: 10px;
  gap: 12px;
`;

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Handle Sign In
  const handleLogin = async () => {
    if (!email || !password) return alert("Enter email and password!");

    dispatch(loginStart());
    try {
      const res = await axios.post("http://localhost:8800/api/auth/signin", {
        email,
        password,
      });
      dispatch(loginSuccess(res.data));
      navigate("/"); // go to homepage
    } catch (err) {
      dispatch(loginFailure());
      alert(err.response?.data?.message || "Sign in failed!");
    }
  };

  // ✅ Handle Sign Up
  const handleSignup = async () => {
    if (!username || !email || !password)
      return alert("Fill all signup fields!");

    dispatch(loginStart());
    try {
      const res = await axios.post("http://localhost:8800/api/auth/signup", {
        username,
        email,
        password,
      });
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      dispatch(loginFailure());
      alert(err.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign in</Title>
        <Subtitle>to continue to RohiTube</Subtitle>

        <Input
          placeholder="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>Sign in</Button>

        <Line>or</Line>
        <GoogleButton>Sign in with Google</GoogleButton>

        <Line>or</Line>
        <Input
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleSignup}>Sign up</Button>

        <Footer>
          <span>English(USA)</span>
          <span>Help</span>
          <span>Privacy</span>
          <span>Terms</span>
        </Footer>
      </Wrapper>
    </Container>
  );
};

export default Signin;
