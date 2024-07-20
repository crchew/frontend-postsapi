import { Container, Row } from "react-bootstrap";
import PostList from "../components/PostList";

export default function HomePage() {
  return (
    <>
      <Container>
        <Row style={{ marginTop: "8rem" }}>
          <PostList />
        </Row>
      </Container>
    </>
  );
}
