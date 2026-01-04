import DashboardBanner from "./components/DashboardBanner";
import RecentActivity from "./components/RecentActivity";
import TodayTasks from "./components/TodayTasks";
import SubjectAccess from "./components/SubjectAccess";
import { Row, Col } from "antd";
import "./Home.scss";

const Home = () => {
  return (
    <div className="home-dashboard">
      {/* Banner Section */}
      <DashboardBanner />

      <div className="dashboard-content">
        <Row gutter={[24, 24]}>
          {/* Left Column (Main) */}
          <Col xs={24} lg={16}>
            {/* Recent Activity */}
            <RecentActivity />

            <div style={{ marginTop: "32px" }}>
              <SubjectAccess />
            </div>
          </Col>

          {/* Right Column (Side) */}
          <Col xs={24} lg={8}>
            <TodayTasks />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
