import { Button, Form, Input, Modal, Row, Select } from "antd";
import { useState } from "react";
import { Typography } from "antd";
import { useGetProduct, usePostAddProduct } from "@/hook/product.hook";
import { ProductType } from "@/constant/enum/product.enum";
import { PostAddProductRequestBody } from "@/hook/product.hook.dto";

const { Title } = Typography;

export const AddProductModalButton: React.FC = () => {
  const addProductFormId = "add-product-form";

  const [openModal, setOpenModal] = useState<boolean>();

  const { mutate: mutateAddProduct, isLoading: isLoadingAddProduct } =
    usePostAddProduct();

  const { refetch: refetchProduct } = useGetProduct();

  const onFinishAddProduct = (input: PostAddProductRequestBody) => {
    mutateAddProduct(input, {
      onSuccess: () => {
        refetchProduct();
        setOpenModal(false);
      },
      onError: (e) => console.log(e),
    });
  };

  const productTypeOptions = [
    {
      label: "food",
      value: ProductType.Food,
    },
    {
      label: "electronic",
      value: ProductType.Electronic,
    },
  ];

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Add product</Button>
      <Modal
        open={openModal}
        confirmLoading={isLoadingAddProduct}
        onCancel={() => setOpenModal(false)}
        okButtonProps={{ form: addProductFormId, htmlType: "submit" }}
        destroyOnClose
      >
        <Row justify="space-around">
          <Title level={4}>Add product</Title>
        </Row>
        <Form
          id={addProductFormId}
          layout="vertical"
          requiredMark={false}
          onFinish={onFinishAddProduct}
        >
          <Form.Item
            label="Product name"
            name="displayName"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter product name",
              },
            ]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>
          <Form.Item
            label="Product code"
            name="code"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter product code",
              },
            ]}
          >
            <Input placeholder="Enter product code" />
          </Form.Item>
          <Form.Item
            label="Product type"
            name="type"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please select product type",
              },
            ]}
          >
            <Select
              placeholder="Select product type"
              options={productTypeOptions}
            />
          </Form.Item>
          <Form.Item
            label="Product price"
            name="price"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter product price",
              },
            ]}
          >
            <Input placeholder="Enter product price" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
