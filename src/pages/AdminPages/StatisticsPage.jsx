import {
  Box,
  Container,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Input,
  Button,
  WrapItem,
  Wrap,
  // useToast,
} from "@chakra-ui/react";
import { Pagination } from "../../components/common";
import { AdminUserDetails } from "../../components/popup";
import React from "react";
import axios from "axios";
import { getToken } from "../../lib/utils";

const StatisticsPage = () => {
  // const toast = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [totalRevenue, setTotalRevenue] = React.useState(0);

  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [meta, setMeta] = React.useState({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPage: 0,
  });
  const [payload, setPayload] = React.useState([]);
  const [user, setUser] = React.useState(null);

  const fetchProduct = async (page) => {
    const response = await axios.get("http://localhost:8080/api/invoices", {
      params: {
        startDate,
        endDate,
        page,
        limit: 10,
        status: "accepted",
      },
      headers: {
        "x-access-token": getToken(),
      },
    });

    const { items, meta } = response.data.payload;

    // Filter items based on startDate and endDate
    const filteredItems = items.filter((item) => {
      const createdAt = new Date(item.updatedAt);
      return (
        (!startDate || createdAt >= new Date(startDate)) &&
        (!endDate || createdAt <= new Date(endDate))
      );
    });

    setMeta(meta);
    setPayload(filteredItems);

    // Calculate total revenue
    const revenue = filteredItems.reduce(
      (total, item) => total + item.totalPaid,
      0
    );
    setTotalRevenue(revenue);
  };

  React.useEffect(() => {
    fetchProduct(1);
  }, []);

  return (
    <Container maxW="6xl" h="100%" padding="15px">
      <AdminUserDetails
        isOpen={isOpen}
        onClose={() => {
          setUser(null);
          setIsOpen(false);
        }}
        user={user}
      />
      <Box boxShadow="xl" h="auto" p="20px" borderRadius={10}>
        <Text fontSize="xl" marginBottom="50px">
          Thống kê doanh thu
        </Text>
        <Box
          borderBottom="1px solid gray"
          paddingBottom="10px"
          marginBottom="20px"
        >
          <HStack flexWrap="wrap" justifyContent="space-between" spacing={6}>
            <Wrap>
              <WrapItem>
                <Text marginRight="8px">Từ ngày:</Text>
                <Input
                  type="date"
                  marginRight="12px"
                  placeholder="Từ ngày"
                  w="180px"
                  value={startDate}
                  size="sm"
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </WrapItem>
              <WrapItem>
                <Text marginRight="8px">Đến ngày:</Text>
                <Input
                  type="date"
                  placeholder="Đến ngày"
                  w="180px"
                  value={endDate}
                  size="sm"
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </WrapItem>
              <WrapItem>
                <Button
                  marginLeft="8px"
                  size="sm"
                  marginRight="6px"
                  colorScheme="facebook"
                  onClick={() => fetchProduct(1)}
                >
                  Lọc
                </Button>
              </WrapItem>
            </Wrap>
          </HStack>
        </Box>

        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Họ và Tên</Th>
                <Th>Địa chỉ</Th>
                <Th>Ngày cập nhật</Th>
                <Th>Tổng đã thanh toán</Th>
              </Tr>
            </Thead>

            <Tbody>
              {payload.length > 0 ? (
                payload.map((item, index) => (
                  <Tr key={`row-${index}`}>
                    <Td fontWeight={500}>
                      {`${item.user.firstName} ${item.user.lastName}`}
                    </Td>
                    <Td fontWeight={500}>{item.user.address}</Td>
                    <Td fontWeight={500}>{item.updatedAt}</Td>
                    <Td fontWeight={500}>{item.totalPaid.toLocaleString()}</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4}>Không có dữ liệu hoá đơn</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>

        <Box mt={4} textAlign="right">
          <Text fontWeight="bold">
            Tổng doanh thu: {totalRevenue.toLocaleString()} (VNĐ)
          </Text>
        </Box>

        <Pagination onClick={fetchProduct} meta={meta} mt={4} />
      </Box>
    </Container>
  );
};

export default StatisticsPage;
