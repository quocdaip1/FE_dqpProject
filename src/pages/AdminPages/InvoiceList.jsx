import {
  Box,
  Center,
  Container,
  IconButton,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { Pagination } from "../../components/common";
import React from "react";
import axios from "axios";
import { getToken } from "../../lib/utils";
import InvoiceDetails from "../../components/popup/InvoiceDetails";
import { HiOutlineEye } from "react-icons/hi2";

const InvoiceList = () => {
  const toast = useToast();
  const [meta, setMeta] = React.useState({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPage: 0,
  });
  const [payload, setPayload] = React.useState([]);
  const [isShowPopup, setIsShowPopup] = React.useState(false);
  const [invoice, setInvoice] = React.useState(null);

  const fetchInvoices = async (page) => {
    const response = await axios.get("http://localhost:8080/api/invoices", {
      params: {
        page,
        limit: 10,
      },
      headers: {
        "x-access-token": getToken(),
      },
    });
    const { items, meta } = response.data.payload;
    setMeta(meta);
    setPayload(items);
  };

  const updateStatus = async (id, status) => {
    let url = ``;
    if (status === "canceled")
      url = `http://localhost:8080/api/invoices/cancel/${id}`;
    else if (status === "accepted")
      url = `http://localhost:8080/api/invoices/accept/${id}`;

    const response = await axios.put(
      url,
      {},
      {
        headers: {
          "x-access-token": getToken(),
        },
      }
    );

    const { message } = response.data;
    if (response.data.status) {
      fetchInvoices(meta.currentPage);
    }
    toast({
      title: message,
      status: status ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  React.useEffect(() => {
    fetchInvoices(1);
  }, []);

  return (
    <Container maxW="6xl" h="100%" padding="15px">
      <InvoiceDetails
        isOpen={isShowPopup}
        onClose={() => {
          setIsShowPopup(false);
          setInvoice(null);
        }}
        invoice={invoice}
      />
      <Box boxShadow="xl" h="auto" p="20px" borderRadius={10}>
        <Text fontSize="xl" marginBottom="20px">
          Đơn hàng
        </Text>
        <TableContainer>
          <Table variant="striped" size="sm">
            <Thead>
              <Tr>
                <Th>Đơn hàng</Th>
                <Th>Tạm tính</Th>
                <Th>Phí vận chuyển</Th>
                <Th>Tổng</Th>
                <Th>Trạng thái</Th>
                <Th textAlign="center">Hành động</Th>
              </Tr>
            </Thead>
            <Tbody>
              {payload.length > 0 ? (
                payload.map((item, index) => (
                  <Tr key={`row-${index}`}>
                    <Td fontWeight={500}>
                      #{item.id.split("").slice(-6).join("")}
                    </Td>
                    <Td fontWeight={500}>
                      {item.total.toLocaleString("vi-VI", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Td>
                    <Td fontWeight={500}>
                      {item.subTotal.toLocaleString("vi-VI", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Td>
                    <Td fontWeight={500}>
                      {item.totalPaid.toLocaleString("vi-VI", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Td>
                    <Td fontWeight={500}>
                      <Select
                        placeholder="Trạng thái"
                        w="180px"
                        size="sm"
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        disabled={item.status !== "pending"}
                      >
                        <option value="pending">Đang chờ</option>
                        <option value="accepted">Xác nhận</option>
                        <option value="canceled">Hủy</option>
                      </Select>
                    </Td>
                    <Td fontWeight={500}>
                      <Center>
                        <IconButton
                          onClick={() => {
                            setInvoice(item);
                            setIsShowPopup(true);
                          }}
                        >
                          <HiOutlineEye />
                        </IconButton>
                      </Center>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={7}>Không có sản phẩm</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
        <Pagination onClick={fetchInvoices} meta={meta} />
      </Box>
    </Container>
  );
};

export default InvoiceList;
