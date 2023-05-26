import React from "react";

import {
  AspectRatio,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  GridItem,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

const InvoiceDetails = (payload) => {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const _renderProduct = () => {
    return (
      <Box>
        {payload?.invoice?.invoiceItems.map((item) => {
          return (
            <>
              <Stack direction="row" key={item.product.id}>
                <AspectRatio boxSize="20">
                  <Image src={item.product.image} w="100%" />
                </AspectRatio>
                <VStack flex={1} alignItems="unset">
                  <Text fontSize="md" fontWeight={500} flex={1}>
                    {item.product.name}
                  </Text>
                  <HStack w="100%" justifyContent="space-between">
                    <Text fontSize="sm" fontWeight={500} flex={1}>
                      Số lượng: {item.quantity}
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight={500}
                      flex={1}
                      textAlign="right"
                    >
                      {item.product.price.toLocaleString("vi-VI", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Text>
                  </HStack>
                </VStack>
              </Stack>
              <Divider marginY={2} />
            </>
          );
        })}
        <HStack justifyContent="space-between">
          <Text fontWeight={600}>Tổng</Text>
          <Text fontWeight={700} color="red">
            {payload?.invoice?.totalPaid.toLocaleString("vi-VI", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        </HStack>
      </Box>
    );
  };

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
          <SimpleGrid columns={[1, 1, 2]} columnGap={10} spacing={10}>
            <GridItem>
              <Text fontSize="lg" fontWeight={600} mb={2}>
                Thông tin mua hàng
              </Text>
              <FormControl>
                <FormLabel>Họ và tên đệm</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Tên"
                  type="text"
                  disabled
                  defaultValue={payload.invoice?.user?.firstName}
                />
              </FormControl>
              <FormControl mt={2}>
                <FormLabel>Tên</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Tên"
                  type="text"
                  disabled
                  defaultValue={payload.invoice?.user?.lastName}
                />
              </FormControl>
              <FormControl mt={2}>
                <FormLabel>E-mail</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Tên"
                  type="text"
                  disabled
                  defaultValue={payload.invoice?.user?.email}
                />
              </FormControl>
              <FormControl mt={2}>
                <FormLabel>Số điện thoại</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Tên"
                  type="text"
                  disabled
                  defaultValue={payload.invoice?.user?.phonenumber}
                />
              </FormControl>
              <FormControl mt={2}>
                <FormLabel>Tỉnh/Thành phố</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Tên"
                  type="text"
                  disabled
                  defaultValue={payload.invoice?.user?.city}
                />
              </FormControl>
              <FormControl mt={2}>
                <FormLabel>Địa chỉ</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Tên"
                  type="text"
                  disabled
                  defaultValue={payload.invoice?.user?.address}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <Text fontSize="lg" fontWeight={600} mb={2}>
                Sản phẩm
              </Text>
              {_renderProduct()}
            </GridItem>
          </SimpleGrid>
        </ModalBody>

        <ModalFooter>
          <Button onClick={payload.onClose}>Đóng</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InvoiceDetails;
