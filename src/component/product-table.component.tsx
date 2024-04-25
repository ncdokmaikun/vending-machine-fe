import { formatIntegerNumber } from "@/common/function";
import { Product } from "@/common/model";
import { useGetChange } from "@/hook/change.hook";
import { useGetProduct, usePostPurchaseOrder } from "@/hook/product.hook";
import { PostPurchaseOrderRequestBody } from "@/hook/product.hook.dto";
import { Button, Col, Form, Input, Modal, Row, Table, Typography } from "antd";
import { sum } from "lodash";
import { useState } from "react";

const { Title } = Typography;

interface PurchaseOrderFormValues {
  product: Array<{ amount: number }>;
  change: Array<{ amount: number }>;
}

export const ProductTable: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product[]>([]);
  const [openOrderModal, setOpenOrderModal] = useState<boolean>();
  const [disabledOkPurchase, setDisabledOkPurchase] = useState<boolean>();

  const purchaseOrderFormId = "purchase-order-form-id";

  const {
    data: getProducts,
    isLoading: isLoadingProduct,
    refetch: refetchProduct,
  } = useGetProduct();

  const { data: getChanges, refetch: refetchChange } = useGetChange();

  const { mutate: mutatePurchaseOrder } = usePostPurchaseOrder();

  const columns = [
    {
      title: "Product name",
      key: "name",
      render: (product: Product) => (
        <span style={!product.stockAmount ? { color: "grey" } : {}}>{`${
          product.displayName
        } ${!product.stockAmount ? "(Out of stock)" : ""}`}</span>
      ),
    },
    {
      title: "Price (Baht)",
      dataIndex: "price",
      key: "price",
      render: (price: string) => formatIntegerNumber(price),
    },
    {
      title: "Stock amount",
      dataIndex: "stockAmount",
      key: "stockAmount",
      render: (amount: string) => formatIntegerNumber(amount),
    },
  ];

  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: Product[]) => {
      setSelectedProduct(selectedRows);
    },

    getCheckboxProps: (product: Product) => ({
      disabled: Number(product.stockAmount) === 0,
      name: product.displayName,
    }),
  };

  const dataSource = getProducts?.products.map((product) => ({
    ...product,
    key: product.id,
  }));

  const remainChanges = getChanges?.remainChanges ?? [];

  const onFinishPurchaseOrder = (input: PurchaseOrderFormValues) => {
    const { product: orderProducts, change: changes } = input;

    const paidWith = Object.keys(changes)
      .filter((id: string) => changes[Number(id)]?.amount)
      .map((id: string) => ({
        id,
        amount: changes[Number(id)].amount,
      }));

    const purchasePayload: PostPurchaseOrderRequestBody = {
      orders: selectedProduct.map((p) => ({
        productId: p.id,
        amount: orderProducts[Number(p.id)].amount,
      })),
      totalPrice: sum(selectedProduct.map((p) => Number(p.price) * 1)),
      paidDetail: {
        total: sum(
          paidWith.map(
            (p) =>
              Number(
                remainChanges.find((r) => Number(r.id) === Number(p.id))?.value
              ) * p.amount
          )
        ),
        paidWith,
      },
    };

    mutatePurchaseOrder(purchasePayload, {
      onSuccess: () => {
        refetchChange();
        refetchProduct();
        setOpenOrderModal(false);
      },
    });
  };

  return (
    <>
      <Form>
        Click purchase button below when you finish your order
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={isLoadingProduct}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          pagination={{
            position: ["bottomLeft"],
          }}
        />
      </Form>
      <Button
        disabled={!selectedProduct?.length}
        onClick={() => setOpenOrderModal(true)}
      >
        {`Purchase total ${selectedProduct?.length} product(s)`}
      </Button>
      <Modal
        open={openOrderModal}
        onCancel={() => setOpenOrderModal(false)}
        okButtonProps={{
          form: purchaseOrderFormId,
          htmlType: "submit",
          disabled: disabledOkPurchase,
        }}
        destroyOnClose
      >
        <Form
          id={purchaseOrderFormId}
          onFinish={onFinishPurchaseOrder}
          scrollToFirstError={{ block: "center" }}
        >
          <Row justify="space-around">
            <Title level={4}>Your order</Title>
          </Row>
          <Row>
            <Col span={10}>
              <Title level={5}>Product</Title>
            </Col>
            <Col span={6}>
              <Title level={5}>Price (Baht)</Title>
            </Col>
            <Col span={8}>
              <Title level={5}>Amount</Title>
            </Col>
          </Row>
          {selectedProduct.map((product) => {
            return (
              <Row key={product.id}>
                <Col span={10}>{product.displayName}</Col>
                <Col span={6}>{product.price}</Col>
                <Col span={8}>
                  <Form.Item
                    name={["product", product.id, "amount"]}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please enter amount",
                      },
                      {
                        transform: (value?: string) =>
                          value ? Number(value) : 0,
                        type: "integer",
                        message: "Accept only integer",
                      },
                      {
                        validator: async (_, value?: string) => {
                          if (Number(value) < 1)
                            return Promise.reject(
                              "Amount must be positive integer"
                            );
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input placeholder="Enter amount" />
                  </Form.Item>
                </Col>
              </Row>
            );
          })}
          <Form.Item shouldUpdate>
            {({ getFieldsValue }) => {
              const { product } = getFieldsValue(["product"]);
              const totalPrice = sum(
                selectedProduct.map((p) => {
                  if (product)
                    return (
                      (Number(p.price) ?? 0) *
                      Number(product[p.id]?.amount ?? 0)
                    );
                  return 0;
                })
              );

              const { change: changes } = getFieldsValue(["change"]) as {
                change: Record<number, { amount: string }>;
              };
              const isRequired =
                !changes ||
                !remainChanges.some(
                  (r) =>
                    changes[Number(r.id)] &&
                    Number(changes[Number(r.id)].amount) > 0
                );

              const totalPaid = changes
                ? sum(
                    Object.keys(changes).map((id) => {
                      return changes[Number(id)]?.amount
                        ? Number(
                            remainChanges.find(
                              (r) => Number(r.id) === Number(id)
                            )?.value
                          ) * Number(changes[Number(id)]?.amount)
                        : 0;
                    })
                  )
                : 0;

              const enoughMoney = totalPaid >= totalPrice;

              setDisabledOkPurchase(!enoughMoney || !totalPrice || isRequired);

              return (
                <>
                  <Row>
                    <Col span={12}>
                      <Title level={5}>Total price: </Title>
                    </Col>
                    <Col span={12}>
                      <Title level={5}>
                        {`${formatIntegerNumber(totalPrice)} Baht`}
                      </Title>
                    </Col>
                  </Row>
                  <Row justify="space-around">
                    <Title level={4}>Pay details</Title>
                  </Row>
                  {remainChanges.map((change) => {
                    return (
                      <Row key={change.id}>
                        <Col span={12}>{change.displayName}</Col>
                        <Col span={12}>
                          <Form.Item
                            name={["change", change.id, "amount"]}
                            rules={[
                              {
                                required: isRequired,
                                whitespace: isRequired,
                                message: "Please enter money",
                              },
                              {
                                transform: (value?: string) =>
                                  value ? Number(value) : 0,
                                type: "integer",
                                message: "Accept only integer",
                              },
                              {
                                validator: async (_, value?: string) => {
                                  if (Number(value) < 1)
                                    return Promise.reject(
                                      "Amount must be positive integer"
                                    );
                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            <Input placeholder="Enter amount" />
                          </Form.Item>
                        </Col>
                      </Row>
                    );
                  })}
                  <Row>
                    <Col span={12}>
                      <Title level={5}>Total paid: </Title>
                    </Col>
                    <Col span={12}>
                      <Title level={5}>
                        {`${formatIntegerNumber(totalPaid)} Baht`}
                      </Title>
                    </Col>
                  </Row>
                  {!enoughMoney && (
                    <Col offset={12} style={{ color: "red" }}>
                      Not enough money!!
                    </Col>
                  )}
                </>
              );
            }}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
