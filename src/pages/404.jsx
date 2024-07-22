import Photo from "../assets/alexander-b-FntgSXIlSwM-unsplash.jpg";

const Error404 = () => {
  return (
    <div
      style={{ marginTop: "10rem", marginLeft: "6rem", textAlign: "center" }}
    >
      <img
        src={Photo}
        alt="404 Image"
        style={{ width: "20%", height: "auto" }}
      />
      <h1>404 Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

export default Error404;
