import React from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import "./index.css";
// 1. import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";
import { AdminLayout, UserLayout } from "./components/default_layout";
import { AdminPages, UserPages } from "./pages";
import { Provider } from "react-redux";
import store from './store'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<UserLayout />}>
              <Route index element={<UserPages.Home />} />
            </Route>
            <Route path="/quan-ly" element={<AdminLayout />}>
              <Route
                path="bang-dieu-khien"
                element={<AdminPages.Dashboard />}
              />
              <Route path="don-hang" element={<AdminPages.InvoiceList />} />
              <Route path="san-pham" element={<AdminPages.ProductList />} />
              <Route path="nguoi-dung" element={<AdminPages.UserList />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
