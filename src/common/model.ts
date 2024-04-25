import { MoneyType } from "@/constant/enum/product.enum";

export interface Product {
  id: string;
  displayName: string;
  code: string;
  price: string;
  stockAmount: string;
}

export interface Change {
  id: string;
  displayName: string;
  code: string;
  type: MoneyType;
  value: number;
  amount: number;
}

export interface Order {
  productId: string;
  amount: number;
}

export interface PaymentDetail {
  total: number;
  paidWith: PaidWith[];
}

export interface PaidWith {
  id: string;
  amount: number;
}
