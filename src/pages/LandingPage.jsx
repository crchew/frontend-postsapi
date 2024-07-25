import { Container, Row, Col, Button } from "react-bootstrap";
import CoverImg from "../assets/patrick-fore-59lC6TgZAbQ-unsplash.jpg";
import BannerImg from "../assets/carlos-muza-hpjSkU2UYSU-unsplash.jpg";

const LandingPage = () => {
  return (
    <>
      <Container
        fluid
        style={{
          backgroundColor: "#3d3d3d",
        }}
      >
        <Row>
          <Col>
            <div
              style={{
                marginTop: "10rem",
                marginRight: "auto",
                textAlign: "center",
                color: "#fff",
              }}
            >
              <h1 className="fs-1">Your Creative Corner</h1>
              <p>Exploring Ideas, One Post at a Time</p>
              <Button href="/login" className="mr-2 btn btn-dark">
                Login
              </Button>
              <Button href="/signup" className="btn btn-light">
                Get started
              </Button>
            </div>
          </Col>
          <Col>
            <div>
              <img
                src={CoverImg}
                alt="Person typing on a typewriter"
                style={{ width: "40rem", height: "auto", objectFit: "contain" }}
              />
            </div>
          </Col>
        </Row>
      </Container>

      {/* Banner Section */}

      <Container
        fluid
        style={{
          backgroundColor: "#f8f9fa",
          padding: "2rem 0",
          position: "relative",
        }}
      >
        <Row className="text-center">
          <Col>
            <img
              src={BannerImg}
              alt="Banner Image"
              style={{ width: "50rem", height: "auto", objectFit: "contain" }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#ffffff",
                textAlign: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "2rem",
                borderRadius: "0.5rem",
              }}
            >
              <h2>Ready to Take Your Ideas to the Next Level?</h2>
              <p>
                Discover how we can help you bring your vision to life with our
                innovative solutions.
              </p>

              <Button className="btn btn-light" size="lg">
                Get a Demo
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Footer Section */}
      <footer
        style={{
          backgroundColor: "#343a40",
          color: "#ffffff",
          padding: "1rem 0",
          textAlign: "center",
        }}
      >
        <Container>
          <Row>
            <Col>
              <p>
                &copy; {new Date().getFullYear()} Your Creative Corner. All
                Rights Reserved.
              </p>
              <p>
                <a href="/privacy-policy" style={{ color: "#ffffff" }}>
                  Privacy Policy
                </a>{" "}
                |{" "}
                <a href="/terms-of-service" style={{ color: "#ffffff" }}>
                  Terms of Service
                </a>
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default LandingPage;
