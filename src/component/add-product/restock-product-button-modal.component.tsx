import { useGetProduct, usePatchRestockProduct } from "@/hook/product.hook";
import { PatchRestockProductRequestBody } from "@/hook/product.hook.dto";
import { Button, Form, Input, Modal, Row, Select, Typography } from "antd";
import { useState } from "react";

const { Title } = Typography;

export const RestockProductButtonModal: React.FC = () => {
  const restockProductFormId = "restock-product-form";

  const [openModal, setOpenModal] = useState<boolean>();

  const { mutate: mutateRestockProduct, isLoading: isLoadingRestockProduct } =
    usePatchRestockProduct();

  const {
    data: getProducts,
    isLoading: isLoadingGetProduct,
    refetch: refetchProduct,
  } = useGetProduct();

  const productOptions = getProducts?.products.map((product) => ({
    label: product.displayName,
    value: product.id,
  }));

  const onFinishRestockProduct = (input: PatchRestockProductRequestBody) => {
    mutateRestockProduct(input, {
      onSuccess: () => {
        refetchProduct(), setOpenModal(false);
      },
      onError: (e) => console.log(e),
    });
  };

  return (
    <>
      <Button onClick={() => setOpenModal(true)} disabled={isLoadingGetProduct}>
        Restock product
      </Button>
      <Modal
        open={openModal}
        confirmLoading={isLoadingRestockProduct}
        onCancel={() => setOpenModal(false)}
        okButtonProps={{ form: restockProductFormId, htmlType: "submit" }}
        destroyOnClose
      >
        <Row justify="space-around">
          <Title level={4}>Restock product</Title>
        </Row>
        <Form
          id={restockProductFormId}
          layout="vertical"
          requiredMark={false}
          onFinish={onFinishRestockProduct}
        >
          <Form.Item
            label="Products"
            name="productId"
            rules={[
              {
                required: true,
                message: "Please select product",
              },
            ]}
          >
            <Select
              placeholder="Select product to restock"
              options={productOptions}
            />
          </Form.Item>
          <Form.Item
            label="Remain stock amount"
            name="stockAmount"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter remain stock",
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
            <Input placeholder="Enter remain stock" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
