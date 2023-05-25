import { Box, Grid, GridItem } from "@chakra-ui/react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Footer, Navbar, Sidebar } from "../layout_part";
import React from "react";
import { getToken } from "../../lib/utils";

const AdminLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const token = getToken();

  React.useEffect(() => {
    if (!token) navigate("/");
  }, [pathname, token, navigate]);

  return (
    <Box as="main" w="100vw" h="100vh" overflowX="hidden">
      <Grid
        templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
        gridTemplateRows={"50px 1fr 42px"}
        gridTemplateColumns={"150px 1fr"}
        h="100%"
        gap="1"
        color="blackAlpha.700"
        fontWeight="bold"
      >
        <GridItem area={"header"}>
          <Sidebar />
        </GridItem>
        <GridItem area={"nav"}>
          <Navbar />
        </GridItem>
        <GridItem area={"main"}>
          <Outlet />
        </GridItem>
        <GridItem area={"footer"}>
          <Footer />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default AdminLayout;
