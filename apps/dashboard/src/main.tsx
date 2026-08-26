import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./Pages/Home/Home";
import { ThemeProvider } from "./components/ThemeProvider/Themeprovider";
import "./index.css";
import { ToastContainer } from "react-toastify";
import SingleUser from "./Pages/SingleUser/SingleUser";
import SingleOrder from "./Pages/SingleOrder/SingleOrder";
import Products from "./Pages/Products/Products";
import SingleProduct from "./Pages/SingleProduct/SingleProduct";
import Payments from "./Pages/Payments/Payments";
import { ClerkProvider } from "@clerk/react";
import User from "./Pages/User/User";
import SignUpPage from "./Pages/SignUpPage/SignUpPage";
import { ui } from "@clerk/ui";
import NoAuthorized from "./Pages/noAuthorized/NoAuthorized";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/noAuthorized",
    element: <NoAuthorized />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/users", element: <User /> },
      { path: "/singleuser/:id", element: <SingleUser /> },
      { path: "/products", element: <Products /> },
      { path: "/singleProduct/:id", element: <SingleProduct /> },
      { path: "/payments", element: <Payments /> },
      { path: "/singleOrder/:id", element: <SingleOrder /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ClerkProvider
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
        ui={ui}
      >
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </ThemeProvider>
      </ClerkProvider>
    </QueryClientProvider>
  </StrictMode>,
);
