import { Order, PaymentDetail, Product } from "@/common/model";

export interface GetProductResponse {
  products: Product[];
}

export interface PostAddProductRequestBody {
  displayName: string;
  code: string;
  type: string;
  price: number;
}

export interface PatchRestockProductRequestBody {
  productId: string;
  stockAmount: number;
}

export interface PostPurchaseOrderRequestBody {
  orders: Order[];
  totalPrice: number;
  paidDetail: PaymentDetail;
}
