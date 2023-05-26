import React from "react";

import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { getToken, getUserData } from "../../../lib/utils";
import axios from "axios";

const InvoiceHistory = (payload) => {
  const toast = useToast();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const userData = getUserData();
  const [invoices, setInvoices] = React.useState([]);

  const fetchInvoiceHistory = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/users/${userData.id}`,
      {
        headers: {
          "x-access-token": getToken(),
        },
      }
    );

    const { status } = response.data;
    if (status) setInvoices(response.data.payload.invoices);
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

    if (response.data.status) fetchInvoiceHistory();

    toast({
      title: message,
      status: status ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  React.useEffect(() => {
    if (payload.isOpen) {
      fetchInvoiceHistory();
    }
  }, [payload.isOpen]);

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={payload.isOpen}
      onClose={payload.onClose}
      size="4xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Lịch sử mua hàng</ModalHeader>
        <ModalBody pb={6}>
          <Box boxShadow="xl" h="auto" p="20px" borderRadius={10}>
            <TableContainer>
              <Table variant="striped" size="sm">
                <Thead>
                  <Tr>
                    <Th>Đơn hàng</Th>
                    <Th>Tạm tính</Th>
                    <Th>Phí vận chuyển</Th>
                    <Th>Tổng</Th>
                    <Th>Trạng thái</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {invoices.length > 0 ? (
                    invoices.map((item, index) => (
                      <Tr key={`row-${index}`}>
                        <Td>#{item.id.split("").slice(-6).join("")}</Td>
                        <Td>
                          {item.total.toLocaleString("vi-VI", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Td>
                        <Td>
                          {item.subTotal.toLocaleString("vi-VI", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Td>
                        <Td>
                          {item.totalPaid.toLocaleString("vi-VI", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Td>
                        <Td>
                          <Select
                            placeholder="Trạng thái"
                            w="180px"
                            size="sm"
                            value={item.status}
                            onChange={(e) =>
                              updateStatus(item.id, e.target.value)
                            }
                            disabled={item.status !== "pending"}
                          >
                            <option value="pending">Đang chờ</option>
                            <option value="canceled">Hủy</option>
                          </Select>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={7}>Không có dữ liệu</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button onClick={payload.onClose}>Đóng</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InvoiceHistory;
