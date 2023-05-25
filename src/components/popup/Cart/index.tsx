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
} from "@chakra-ui/react";

const Cart = (payload) => {
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
        <ModalHeader>Đăng nhập tài kh</ModalHeader>
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>E-mail</FormLabel>
            <Input ref={initialRef} placeholder="example@email.com" type="email" />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Mật khẩu</FormLabel>
            <Input placeholder="******" type="password" />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3}>
            Đăng nhập
          </Button>
          <Button onClick={payload.onClose}>Hủy</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Cart;
