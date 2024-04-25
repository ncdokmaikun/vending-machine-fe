import axios from "axios";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";

axios.defaults.baseURL = "http://localhost:3000";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
