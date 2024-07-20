import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SiBlogger } from "react-icons/si";
import { useDispatch } from "react-redux";
import { logout } from "../authActions";
import isAuthenticated from "../authUtils";

export default function NavBar() {
  const dispatch = useDispatch();

  const handleLogoutClick = () => {
    dispatch(logout());
  };

  return (
    <Navbar
      expand="lg"
      style={{
        backgroundColor: "#244855",
        color: "#fff",
        position: "fixed",
        zIndex: 1,
        top: 0,
        width: "100vw",
      }}
    >
      <Container
        className="p-4"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: "4rem",
        }}
      >
        <SiBlogger />

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{ textAlign: "end" }}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {!isAuthenticated() ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  style={{
                    color: "var(--font-color)",
                    padding: "1rem",
                    textDecoration: "none",
                  }}
                >
                  Login
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/signup"
                  style={{
                    color: "var(--font-color)",
                    padding: "1rem",
                    textDecoration: "none",
                  }}
                >
                  Signup
                </Nav.Link>
              </>
            ) : (
              <Nav.Link
                as={Link}
                to="/login"
                style={{
                  color: "var(--font-color)",
                  padding: "1rem",
                  textDecoration: "none",
                }}
                onClick={handleLogoutClick}
              >
                Logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
