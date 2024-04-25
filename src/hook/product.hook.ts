import axios, { AxiosError } from "axios";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "react-query";
import {
  GetProductResponse,
  PatchRestockProductRequestBody,
  PostAddProductRequestBody,
  PostPurchaseOrderRequestBody,
} from "./product.hook.dto";

const productPath = {
  product: "/api/product",
  purchase: "/api/product/purchase",
};

export const useGetProduct = () => {
  const getProductData = async (): Promise<GetProductResponse> => {
    const response = await axios.get(productPath.product);
    return response.data;
  };

  return useQuery("productData", getProductData, {
    keepPreviousData: true,
  });
};

export const usePostAddProduct = (): UseMutationResult<
  unknown,
  AxiosError,
  PostAddProductRequestBody
> => {
  const mutationFn = async (data: PostAddProductRequestBody) =>
    axios.post(productPath.product, data).then((res) => res.data);

  return useMutation(mutationFn);
};

export const usePatchRestockProduct = (): UseMutationResult<
  unknown,
  AxiosError,
  PatchRestockProductRequestBody
> => {
  const mutationFn = async (data: PatchRestockProductRequestBody) =>
    axios.patch(productPath.product, data).then((res) => res.data);

  return useMutation(mutationFn);
};

export const usePostPurchaseOrder = (): UseMutationResult<
  unknown,
  AxiosError,
  PostPurchaseOrderRequestBody
> => {
  const mutationFn = async (data: PostPurchaseOrderRequestBody) =>
    axios.post(productPath.purchase, data).then((res) => res.data);

  return useMutation(mutationFn);
};
