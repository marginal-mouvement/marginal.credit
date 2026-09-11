import key from "../../assets/key.png";
import { Content } from "../../parts/content.tsx";

export const LandingPage = () => {
  return (
    <Content className="flex justify-center items-center h-svh pb-0">
      <img className="max-w-80 animate-bounce" src={key} alt="key" />
    </Content>
  );
};
