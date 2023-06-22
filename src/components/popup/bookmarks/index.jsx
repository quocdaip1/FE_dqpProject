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
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { getToken, getUserData } from "../../../lib/utils";
import axios from "axios";
import InvoiceDetails from "../InvoiceDetails";

const InvoiceHistory = (payload) => {

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const userData = getUserData();
  const [isShowPopup, setIsShowPopup] = React.useState(false);
  const [invoice, setInvoice] = React.useState(null);
  const [savedProduct, setSavedProduct] = React.useState([]);

  const getUserFav = async () => {
    const res = await axios.get(
      `http://localhost:8080/api/users/${userData.id}`,
      {
        headers: {
          "x-access-token": getToken(),
        },
      }
    );
    setSavedProduct(res.data?.payload?.productSaveds || []);
  };

  React.useEffect(() => {
    getUserFav();
  }, [payload.isOpen]);

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={payload.isOpen}
      onClose={payload.onClose}
      size="4xl"
    >
      <InvoiceDetails
        isOpen={isShowPopup}
        onClose={() => {
          setIsShowPopup(false);
          setInvoice(null);
        }}
        invoice={invoice}
      />
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Danh sách yêu thích</ModalHeader>
        <ModalBody pb={6}>
          <Box boxShadow="xl" h="auto" p="20px" borderRadius={10}>
            <TableContainer>
              <Table variant="striped" size="sm">
                <Thead>
                  <Tr>
                    <Th>Mã</Th>
                    <Th>Tên</Th>
                    <Th>Giá</Th>
                    <Th>Trạng thái</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {savedProduct.length > 0 ? (
                    savedProduct.map((item, index) => (
                      <Tr key={`row-${index}`}>
                        <Td>#{item.product.code}</Td>
                        <Td>{item.product.name}</Td>
                        <Td>
                          {item.product.price.toLocaleString("vi-VI", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Td>
                        <Td>
                          {item.product.status === "active"
                            ? "Còn hàng"
                            : item.product.status === "outOfStock"
                            ? "Hết hàng"
                            : "Không hoạt động"}
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
