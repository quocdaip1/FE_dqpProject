import {
  Box,
  Container,
  Grid,
  GridItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getToken } from "../../lib/utils";
import axios from "axios";
import React from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsCard = (payload) => {
  return (
    <Box
      boxShadow="xl"
      borderRadius={10}
      border="1px solid rgba(0,0,0,0.5)"
      padding="10px"
    >
      <Text fontSize="md">{payload.name}</Text>
      <Text fontSize="3xl" marginTop="10px" textAlign="right">
        {payload.total}
      </Text>
    </Box>
  );
};

const Dashboard = () => {
  const [total, setTotal] = React.useState({
    users: 0,
    products: 0,
    invoices: 0,
  });
  const [chartProps, setChartProps] = React.useState({
    labels: [],
    datasets: [
      {
        label: "Sản phẩm bán chạy nhất",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  });
  const [rattingChartProps, setRattingChartProps] = React.useState({
    labels: [],
    datasets: [
      {
        label: "Sản phẩm đánh giá cao nhất",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  });

  const fetchRatingsForAllProducts = async () => {
    try {
      const ratingsResponse = await axios.get(
        "http://localhost:8080/api/ratings/all",
        {
          headers: {
            "x-access-token": getToken(),
          },
        }
      );

      const allProductsRatings = ratingsResponse.data.payload;

      // Prepare data for the chart
      const ratingChartLabel = allProductsRatings.map((rating) => rating.productName);
      const ratingChartData = allProductsRatings.map((rating) => rating.averageRating);

      setRattingChartProps({
        labels: ratingChartLabel,
        datasets: [
          {
            label: "Sản phẩm đánh giá cao nhất",
            data: ratingChartData,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(255, 205, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(201, 203, 207, 0.2)",
            ],
            borderColor: [
              "rgb(255, 99, 132)",
              "rgb(255, 159, 64)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)",
              "rgb(153, 102, 255)",
              "rgb(201, 203, 207)",
            ],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching ratings for all products:", error);
    }
  };

  React.useEffect(() => {
    fetchStatistic();
    fetchRatingsForAllProducts(); // Fetch ratings for all products when the component mounts
  }, []);

  // ... (rest of the code

  const fetchStatistic = async () => {
    console.log(getToken());
    const invoices = await axios.get("http://localhost:8080/api/invoices", {
      params: {
        page: 1,
        limit: 10,
      },
      headers: {
        "x-access-token": getToken(),
      },
    });
    const users = await axios.get("http://localhost:8080/api/users", {
      params: {
        page: 1,
        limit: 10,
      },
      headers: {
        "x-access-token": getToken(),
      },
    });
    const products = await axios.get("http://localhost:8080/api/products", {
      params: {
        keyword: "",
        status: "",
        page: 1,
        limit: 10,
      },
      headers: {
        "x-access-token": getToken(),
      },
    });
    const rattings = await axios.get("http://localhost:8080/api/rattings", {
      params: {},
      headers: {
        "x-access-token": getToken(),
      },
    });

    const productDashboard = await axios.get(
      "http://localhost:8080/api/dashboard",
      {
        params: {},
        headers: {
          "x-access-token": getToken(),
        },
      }
    );

    const resolveChartLabel = [];
    const resolveChartData = [];

    const ratingChartLabel = [];
    const ratingChartData = [];

    productDashboard.data.payload.forEach((item) => {
      resolveChartLabel.push(item.name);
      resolveChartData.push(item.total);
    });

    rattings.data.payload.forEach((item) => {
      ratingChartLabel.push(item.name);
      ratingChartData.push(item.total);
    });

    setChartProps({
      labels: resolveChartLabel,
      datasets: [
        {
          label: "Sản phẩm bán chạy nhất",
          data: resolveChartData,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(201, 203, 207, 0.2)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
            "rgb(201, 203, 207)",
          ],
          borderWidth: 1,
        },
      ],
    });
    setRattingChartProps({
      labels: ratingChartLabel,
      datasets: [
        {
          label: "Sản phẩm đánh giá cao nhất",
          data: ratingChartData,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(201, 203, 207, 0.2)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
            "rgb(201, 203, 207)",
          ],
          borderWidth: 1,
        },
      ],
    });
    setTotal({
      invoices: invoices.data.payload.meta.totalItems,
      users: users.data.payload.meta.totalItems,
      products: products.data.payload.meta.totalItems,
    });
  };

  React.useEffect(() => {
    fetchStatistic();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Doanh thu",
      },
    },
  };

  return (
    <Container maxWidth="6xl" h="100%" padding="15px">
      <Box boxShadow="xl" h="auto" p="20px" borderRadius={10}>
        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
          <GridItem>
            <StatisticsCard name="Sản phẩm" total={total.products} />
          </GridItem>
          <GridItem>
            <StatisticsCard name="Đơn hàng" total={total.invoices} />
          </GridItem>
          <GridItem>
            <StatisticsCard name="Người dùng" total={total.users} />
          </GridItem>
        </Grid>
        <Box w="100%" marginTop="36px">
          <Tabs>
            <TabList>
              <Tab
                sx={{
                  outline: "0 !important",
                  borderTopColor: "transparent !important",
                  borderLeftColor: "transparent !important",
                  borderRightColor: "transparent !important",
                  // border: "none !important",
                  borderRadius: "0px",
                }}
                _focus={{
                  boxShadow: "none",
                }}
              >
                Top 10 sản phẩm bán chạy nhất
              </Tab>
              <Tab
                sx={{
                  outline: "0 !important",
                  // border: "none !important",
                  borderTopColor: "transparent !important",
                  borderLeftColor: "transparent !important",
                  borderRightColor: "transparent !important",
                  // border: "none !important",
                  borderRadius: "0px",
                }}
                _focus={{
                  boxShadow: "none",
                }}
              >
                Top 10 sản phẩm đánh giá cao nhất
              </Tab>
              <Tab
                sx={{
                  outline: "0 !important",
                  // border: "none !important",
                  borderTopColor: "transparent !important",
                  borderLeftColor: "transparent !important",
                  borderRightColor: "transparent !important",
                  // border: "none !important",
                  borderRadius: "0px",
                }}
                _focus={{
                  boxShadow: "none",
                }}
              >
                Danh sách đánh giá của các sản phẩm
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Bar options={options} data={chartProps} />
              </TabPanel>
              <TabPanel>
                <Bar options={options} data={rattingChartProps} />
              </TabPanel>
              <TabPanel>
                <Bar options={options} data={rattingChartProps} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
