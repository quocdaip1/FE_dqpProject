import React from "react";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
} from "@chakra-ui/react";
import City from "../../../lib/city";

const AdminUserDetails = (payload) => {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={payload.isOpen}
      onClose={payload.onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thông tin người dùng</ModalHeader>
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Họ và tên đệm</FormLabel>
            <Input
              ref={initialRef}
              placeholder="Họ và tên đệm"
              type="text"
              defaultValue={payload.user?.firstName || ""}
              isReadOnly
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Tên</FormLabel>
            <Input
              ref={initialRef}
              placeholder="Tên"
              type="text"
              defaultValue={payload.user?.lastName || ""}
              isReadOnly
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>E-mail</FormLabel>
            <Input
              ref={initialRef}
              placeholder="exampe@email.com"
              type="text"
              defaultValue={payload.user?.email || ""}
              isReadOnly
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Số điện thoại</FormLabel>

            <Input
              placeholder="0xxxxxxxxx"
              type="tel"
              defaultValue={payload.user?.phonenumber || ""}
              isReadOnly
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Tỉnh/Thành phố</FormLabel>
            <Select
              placeholder="Tỉnh/Thành phố"
              defaultValue={payload.user?.city || ""}
              isReadOnly
              disabled
            >
              {City.map((item) => (
                <option value={item.city} key={`option-${item.city}`}>
                  {item.city}{" "}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Địa chỉ</FormLabel>
            <Textarea
              placeholder="Kiệt , Phường X, ..."
              type="tel"
              defaultValue={payload.user?.address || ""}
              isReadOnly
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={payload.onClose}>Đóng</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdminUserDetails;
