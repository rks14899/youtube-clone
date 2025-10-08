import React from "react";
import styled from "styled-components";
import RohiTube from "../img/logo.png";
import HomeIcon from "@mui/icons-material/Home";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Container = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 100vh;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  position: sticky;
  top: 0;
  overflow-y: auto;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: ${({ open }) => (open ? "0" : "-250px")};
    width: 250px;
    z-index: 1200;
    box-shadow: ${({ open }) =>
      open ? "4px 0 15px rgba(0,0,0,0.3)" : "none"};
  }
`;

const Overlay = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: ${({ open }) => (open ? "block" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
`;

const Wrapper = styled.div`
  padding: 18px 26px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  margin-bottom: 25px;
  font-size: 18px;
`;

const Img = styled.img`
  height: 25px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 0px;

  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }

  @media (max-width: 480px) {
    gap: 15px;
    font-size: 13px;
  }
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Login = styled.div`
  font-size: 13px;
  line-height: 1.5;
`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 500;
  color: #aaaaaa;
  margin-bottom: 20px;
`;

const Menu = ({ darkMode, setDarkMode, open, setOpen }) => {
  const { currentUser } = useSelector((state) => state.user);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Overlay open={open} onClick={handleClose} />
      <Container open={open}>
        <Wrapper>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Logo onClick={handleClose}>
              <Img src={RohiTube} alt="logo" />
              RohiTube
            </Logo>
          </Link>

          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Item onClick={handleClose}>
              <HomeIcon />
              Home
            </Item>
          </Link>

          <Link to="/trends" style={{ textDecoration: "none", color: "inherit" }}>
            <Item onClick={handleClose}>
              <ExploreOutlinedIcon />
              Explore
            </Item>
          </Link>

          <Link to="/subscriptions" style={{ textDecoration: "none", color: "inherit" }}>
            <Item onClick={handleClose}>
              <SubscriptionsOutlinedIcon />
              Subscriptions
            </Item>
          </Link>

          <Hr />
          <Item onClick={handleClose}>
            <VideoLibraryOutlinedIcon />
            Library
          </Item>
          <Item onClick={handleClose}>
            <HistoryOutlinedIcon />
            History
          </Item>
          <Hr />

          {!currentUser && (
            <>
              <Login>
                Sign in to like videos, comment, and subscribe.
                <Link to="/signin" style={{ textDecoration: "none" }}>
                  <Button>
                    <AccountCircleOutlinedIcon />
                    SIGN IN
                  </Button>
                </Link>
              </Login>
              <Hr />
            </>
          )}

          <Title>BEST OF ROHITUBE</Title>
          <Item onClick={handleClose}>
            <LibraryMusicOutlinedIcon />
            Music
          </Item>
          <Item onClick={handleClose}>
            <SportsBasketballOutlinedIcon />
            Sports
          </Item>
          <Item onClick={handleClose}>
            <SportsEsportsOutlinedIcon />
            Gaming
          </Item>
          <Item onClick={handleClose}>
            <MovieOutlinedIcon />
            Movies
          </Item>
          <Item onClick={handleClose}>
            <ArticleOutlinedIcon />
            News
          </Item>
          <Item onClick={handleClose}>
            <LiveTvOutlinedIcon />
            Live
          </Item>

          <Hr />
          <Item onClick={handleClose}>
            <SettingsOutlinedIcon />
            Settings
          </Item>
          <Item onClick={handleClose}>
            <FlagOutlinedIcon />
            Report
          </Item>
          <Item onClick={handleClose}>
            <HelpOutlineOutlinedIcon />
            Help
          </Item>
          <Item
            onClick={() => {
              setDarkMode(!darkMode);
              handleClose();
            }}
          >
            <SettingsBrightnessOutlinedIcon />
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Item>
        </Wrapper>
      </Container>
    </>
  );
};

export default Menu;
