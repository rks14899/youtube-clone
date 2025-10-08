import React, { useState } from "react";
import styled from "styled-components";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Upload from "./Upload";
import { logout } from "../redux/userSlice";
import RohiTubeLogo from "../img/logo.png";

// ------------------ STYLED COMPONENTS ------------------

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px;
  z-index: 100;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0px 20px;
  gap: 10px;
  position: relative;

  @media (max-width: 992px) {
    padding: 0 14px;
    gap: 8px;
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    padding: 6px 10px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    padding: 8px;
    gap: 6px;
  }
`;

const LeftSection = styled.div`
  display: none;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    display: flex;
    flex: 1;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: bold;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
`;

const Img = styled.img`
  height: 20px;
  width: 20px;
  object-fit: contain;
`;

const CenterSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    justify-content: center;
    order: 3;
    width: 100%;
  }
`;

const Search = styled.div`
  width: 45%;
  max-width: 600px;
  min-width: 220px;
  background-color: ${({ theme }) => theme.bg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 4px;
  color: ${({ theme }) => theme.text};
  pointer-events: all;
  transition: width 0.3s ease;

  @media (max-width: 992px) {
    width: 60%;
  }

  @media (max-width: 768px) {
    width: 80%;
  }

  @media (max-width: 480px) {
    width: 95%;
  }
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
  width: 100%;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 5px 12px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background-color: #3ea6ff;
    color: white;
  }

  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 12px;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  min-width: 220px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.text};
  font-weight: 500;

  @media (max-width: 992px) {
    min-width: 160px;
    gap: 8px;
  }

  @media (max-width: 768px) {
    min-width: unset;
    gap: 6px;
    flex: 1;
    justify-content: center;
    order: 2;
  }

  @media (max-width: 480px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
  }
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #999;
  cursor: pointer;
`;

const AvatarWrapper = styled.div`
  position: relative;
  display: inline-block;

  &:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip = styled.div`
  visibility: hidden;
  opacity: 0;
  width: max-content;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  position: absolute;
  z-index: 1;
  bottom: -45px;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.3s;
  font-size: 12px;
`;

// ------------------ MAIN NAVBAR ------------------

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  const backendURL =
    process.env.REACT_APP_API_URL?.replace("/api", "") ||
    "http://localhost:8800";

  const getProfileImage = (imgPath) => {
    if (!imgPath) return `${backendURL}/profiles/default-profile.png`;
    if (imgPath.startsWith("http")) return imgPath;
    return `${backendURL}${imgPath}`;
  };

  return (
    <>
      <Container>
        <Wrapper>
          {/* LEFT SECTION */}
          <LeftSection>
            <MenuIcon
              onClick={toggleSidebar}
              style={{ cursor: "pointer", fontSize: "26px" }}
            />
            <Logo>
              <Img src={RohiTubeLogo} alt="RohiTube" />
              RohiTube
            </Logo>
          </LeftSection>

          {/* CENTER SEARCH SECTION */}
          <CenterSection>
            {location.pathname !== "/signin" && (
              <Search>
                <Input
                  placeholder="Search"
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && navigate(`/search?q=${q}`)
                  }
                />
                <SearchOutlinedIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/search?q=${q}`)}
                />
              </Search>
            )}
          </CenterSection>

          {/* RIGHT USER SECTION */}
          <UserSection>
            {currentUser ? (
              <>
                <VideoCallOutlinedIcon
                  onClick={() => setOpen(true)}
                  style={{ cursor: "pointer" }}
                />
                <AvatarWrapper>
                  <Avatar
                    src={getProfileImage(currentUser.img)}
                    alt={currentUser?.username || "User Avatar"}
                  />
                  <Tooltip className="tooltip">
                    {currentUser.username}
                    <br />
                    {currentUser.email}
                  </Tooltip>
                </AvatarWrapper>
                <span>{currentUser.username}</span>
                <Button onClick={handleLogout}>LOGOUT</Button>
              </>
            ) : (
              <Link to="/signin" style={{ textDecoration: "none" }}>
                <Button>
                  <AccountCircleOutlinedIcon />
                  SIGN IN
                </Button>
              </Link>
            )}
          </UserSection>
        </Wrapper>
      </Container>

      {open && <Upload setOpen={setOpen} />}
    </>
  );
};

export default Navbar;
