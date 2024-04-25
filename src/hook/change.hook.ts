import axios, { AxiosError } from "axios";
import { useMutation, UseMutationResult, useQuery } from "react-query";
import {
  FindRemainChangeResponse,
  PatchAddChangeMoneyRequestBody,
} from "./change.hook.dto";

const changePath = {
  change: "/api/change",
};

export const useGetChange = () => {
  const getChangeData = async (): Promise<FindRemainChangeResponse> => {
    const response = await axios.get(changePath.change);
    return response.data;
  };

  return useQuery("changeData", getChangeData, {
    keepPreviousData: true,
  });
};

export const usePatchAddChangeMoney = (): UseMutationResult<
  unknown,
  AxiosError,
  PatchAddChangeMoneyRequestBody
> => {
  const mutationFn = async (data: PatchAddChangeMoneyRequestBody) =>
    axios.patch(changePath.change, data).then((res) => res.data);

  return useMutation(mutationFn);
};
