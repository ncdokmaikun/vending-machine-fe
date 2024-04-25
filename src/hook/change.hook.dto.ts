import { Change } from "@/common/model";

export interface FindRemainChangeResponse {
  totalValue: string;
  remainChanges: Change[];
}

export interface PatchAddChangeMoneyRequestBody {
  changeId: string;
  amount: number;
}
