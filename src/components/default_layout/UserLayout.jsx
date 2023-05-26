import { Box, Container } from "@chakra-ui/react";
import { Outlet } from "react-router";
import { Footer, Header } from "../layout_part";
import { useDispatch } from "react-redux";
import { getCart } from "../../lib/utils";
import { setCart } from "../../cartSlice";
import React from "react";

const UserLayout = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    const cart = getCart();
    dispatch(setCart(cart));
  }, []);

  return (
    <Box as="main" w="100vw" h="100vh" overflowX="hidden">
      <Header />
      <Container
        maxW="1280px"
        minH="calc(100vh - 102px)"
        margin="0 auto"
        p="24px"
      >
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};

export default UserLayout;
