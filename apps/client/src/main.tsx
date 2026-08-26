import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home.tsx";
import CartPage from "./pages/CartPage/CartPage.tsx";
import SingleProduct from "./pages/SingleProduct/SingleProduct.tsx";
import Products from "./pages/Products/Products.tsx";
import { ClerkProvider } from "@clerk/react-router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import SignIn from "./pages/SignIn.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignUpPage from "./pages/SignUp/SignUpPage.tsx";
import Orders from "./pages/Orders/Orders.tsx";

import SingleOrder from "./pages/SingleOrder/SingleOrder.tsx";
import Return from "./pages/Return/Return.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ClerkProvider
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      >
        <App />
      </ClerkProvider>
    ),
    children: [
      { index: true, element: <Home /> },
      {
        path: "/singleProduct/:id",
        element: <SingleProduct />,
      },
      { path: "/cartPage", element: <CartPage /> },
      { path: "/products", element: <Products /> },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/sing-up",
        element: <SignUpPage />,
      },
      {
        path: "/sing-in",
        element: <SignIn />,
      },
      {
        path: "/singleOrder",
        element: <SingleOrder />,
      },
      {
        path: "/return",
        element: <Return />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      <ToastContainer
        className="my-toast-container"
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </QueryClientProvider>
  </StrictMode>,
);
