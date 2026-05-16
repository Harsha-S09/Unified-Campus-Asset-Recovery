import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>CampusHelp Lost & Found Portal</h1>
        <p>
          Helping students report and recover lost items quickly and safely.
        </p>

        <div className="home-buttons">
          <Link to="/login">
            <button className="primary">Login</button>
          </Link>

          <Link to="/register">
            <button className="secondary">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;