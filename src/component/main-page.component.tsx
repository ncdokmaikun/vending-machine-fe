import { Row, Space } from "antd";
import { Typography } from "antd";
import { AddProductModalButton } from "./add-product/add-product-button-modal.component";
import { ProductTable } from "./product-table.component";
import { RestockProductButtonModal } from "./add-product/restock-product-button-modal.component";
import { ChangeTable } from "./remain-change-table.component";

const { Title } = Typography;

const MainPage: React.FC = () => {
  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Row justify="space-around">
        <Title>My vending machine</Title>
      </Row>
      <Space size={8}>
        <AddProductModalButton />
        <RestockProductButtonModal />
        <span style={{ color: "red" }}>
          Only admin can see and click these 2 button
        </span>
      </Space>
      <ProductTable />
      <span style={{ color: "red" }}>
        Only admin can see and click below component
      </span>
      <ChangeTable />
    </Space>
  );
};

export default MainPage;
