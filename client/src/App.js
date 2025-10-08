import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";

import Search from "./pages/Search";
import { useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  overflow-y: auto;
`;

const Wrapper = styled.div`
  padding: 22px 96px;

  @media (max-width: 992px) {
    padding: 20px 40px;
  }

  @media (max-width: 768px) {
    padding: 15px 20px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
  }
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        {/* Sidebar Menu */}
        <Menu
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          open={menuOpen}
          setOpen={setMenuOpen}
        />

        {/* Main Section */}
        <Main>
          <Navbar toggleSidebar={() => setMenuOpen(!menuOpen)} />
          <Wrapper>
            <Routes>
              <Route path="/">
                <Route index element={<Home type="user" />} />
                <Route path="trends" element={<Home type="all" />} />
                <Route path="subscriptions" element={<Home type="sub" />} />
                <Route path="search" element={<Search />} />
                <Route
                  path="signin"
                  element={currentUser ? <Home /> : <SignIn />}
                />

                <Route path="video">
                  <Route path=":id" element={<Video />} />
                </Route>
              </Route>
            </Routes>
          </Wrapper>
        </Main>
      </Container>
    </ThemeProvider>
  );
}

export default App;
