import { Link } from "react-router-dom";
import { Button } from "antd";
function LandingPageButton() {
  return (
    <Link to="/about" class="nav-link">
      <Button type="primary">
        <Link to="/signup">Click Me!</Link>
      </Button>
    </Link>
  );
}
function LandingFrameMessage() {
  const style = {
    margin: "auto",
    padding: "32% 90% 10% 6%",
    color: "white",
  };
  return (
    <div style={style}>
      {/* <div style={{ "font-size": "96px" }}>Hello World!!</div>

      <div style={{ "font-size": "36px" }}>
        Upload your first pdf document and collabarate
      </div> */}
      <br />
      <br />
      <LandingPageButton />
    </div>
  );
}
function LandingFrame() {
  const style = {
    "background-image": `url("bg-img.png")`,
    "background-repeat": "no-repeat",
    "background-size": "cover",
    position: "absolute",
    height: "100%",
    width: "100%",
  };
  return (
    <div style={style}>
      <LandingFrameMessage />
    </div>
  );
}
function HomePage() {
  return (
    <div>
      <LandingFrame />
    </div>
  );
}
export default HomePage;
