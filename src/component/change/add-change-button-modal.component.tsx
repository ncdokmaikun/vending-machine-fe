import { useGetChange, usePatchAddChangeMoney } from "@/hook/change.hook";
import { PatchAddChangeMoneyRequestBody } from "@/hook/change.hook.dto";
import { Button, Form, Input, Modal, Row, Select, Typography } from "antd";
import { useState } from "react";

const { Title } = Typography;

export const AddChangeMoneyButtonModal: React.FC = () => {
  const addChangeMoneyFormId = "add-change-money-form";

  const [openModal, setOpenModal] = useState<boolean>();

  const { mutate: mutateAddChangeMoney, isLoading: isLoadingAddChangeMoney } =
    usePatchAddChangeMoney();

  const {
    data: getChanges,
    isLoading: isLoadingGetChange,
    refetch: refetchChange,
  } = useGetChange();

  const changeOptions = getChanges?.remainChanges.map((change) => ({
    label: change.displayName,
    value: change.id,
  }));

  const onFinishAddChangeMoney = (input: PatchAddChangeMoneyRequestBody) => {
    mutateAddChangeMoney(input, {
      onSuccess: () => {
        refetchChange(), setOpenModal(false);
      },
      onError: (e) => console.log(e),
    });
  };

  return (
    <>
      <Button
        onClick={() => setOpenModal(true)}
        disabled={isLoadingGetChange}
        style={{ marginTop: "16px" }}
      >
        Add change money
      </Button>
      <Modal
        open={openModal}
        confirmLoading={isLoadingAddChangeMoney}
        onCancel={() => setOpenModal(false)}
        okButtonProps={{ form: addChangeMoneyFormId, htmlType: "submit" }}
        destroyOnClose
      >
        <Row justify="space-around">
          <Title level={4}>Add change money</Title>
        </Row>
        <Form
          id={addChangeMoneyFormId}
          layout="vertical"
          requiredMark={false}
          onFinish={onFinishAddChangeMoney}
        >
          <Form.Item
            label="Changes"
            name="changeId"
            rules={[
              {
                required: true,
                message: "Please select money type",
              },
            ]}
          >
            <Select
              placeholder="Select money type to add"
              options={changeOptions}
            />
          </Form.Item>
          <Form.Item
            label="Add amount"
            name="amount"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter amount",
              },
              {
                transform: (value: string) => Number(value),
                type: "integer",
                message: "Accept only integer",
              },
              {
                validator: async (_, value: string) => {
                  if (Number(value) < 0)
                    return Promise.reject("Amount must be positive integer");
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Enter amount" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
