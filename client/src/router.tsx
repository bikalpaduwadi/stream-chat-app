import { Outlet, createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AuthLayout from "./pages/layouts/AuthLayout";
import RootLayout from "./pages/layouts/RootLayout";
import { AuthProvider } from "./context/AuthContext";

const ContextWrapper = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export const router = createBrowserRouter([
  {
    element: <ContextWrapper />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { index: true, element: <Home /> },
          {
            path: "/channel",
            children: [
              {
                path: "new",
                element: <h1>New channel</h1>,
              },
            ],
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "signup", element: <SignUp /> },
        ],
      },
    ],
  },
]);
