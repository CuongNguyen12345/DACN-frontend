import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const HeroSection = () => {
  return (
    <div className="home-hero">
      <Title level={1} className="home-hero__title">
        Học tập hiệu quả, Tự tin thi cử
      </Title>
      <Paragraph className="home-hero__desc">
        Hệ thống học tập tự học toàn diện cho học sinh THPT với đầy đủ tài liệu,
        video bài giảng và bài tập từ khối 10 đến khối 12
      </Paragraph>
    </div>
  );
};

export default HeroSection;
