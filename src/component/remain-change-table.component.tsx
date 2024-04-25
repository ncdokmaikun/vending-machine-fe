import { formatIntegerNumber } from "@/common/function";
import { useGetChange } from "@/hook/change.hook";
import { Space, Table, Typography } from "antd";
import { AddChangeMoneyButtonModal } from "./change/add-change-button-modal.component";

const { Title } = Typography;

export const ChangeTable: React.FC = () => {
  const columns = [
    {
      title: "Change name",
      dataIndex: "displayName",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: string) => formatIntegerNumber(amount),
    },
  ];

  const { data: getChanges, isLoading: isLoadingChange } = useGetChange();

  const dataSource = getChanges?.remainChanges.map((change) => ({
    ...change,
    key: change.id,
  }));

  return (
    <>
      <Space size={8} style={{ width: "100%" }}>
        <Title level={3}>
          {`Remain change (total ${formatIntegerNumber(
            getChanges?.totalValue ?? "0"
          )} baht)`}
        </Title>
        <AddChangeMoneyButtonModal />
      </Space>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={isLoadingChange}
        pagination={false}
      />
    </>
  );
};
