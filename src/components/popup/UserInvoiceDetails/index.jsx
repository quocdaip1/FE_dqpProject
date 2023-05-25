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
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { selectCart, setCart } from "../../../cartSlice";
import { getToken, getUserData, setCartCookies } from "../../../lib/utils";
import axios from "axios";

const UserInvoiceDetails = (payload) => {
  const [paymentType, setPaymentType] = React.useState("cash");
  const { cart } = useSelector(selectCart);
  const dispatch = useDispatch();
  const userData = getUserData();
  const toast = useToast();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const onSubmit = async () => {
    const resolvePayload = cart.map((item) => ({
      productCode: item.product.code,
      quantity: item.quantity,
    }));
    const response = await axios.post(
      `http://localhost:8080/api/invoices`,
      {
        items: resolvePayload,
      },
      {
        headers: {
          "x-access-token": getToken(),
        },
      }
    );
    const { status, message } = response.data;

    if (status) {
      dispatch(setCart([]));
      setCartCookies([]);
    }
    toast({
      title: message,
      status: status ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
    payload.onClose();
  };

  const _renderProduct = () => {
    let total = 0;
    return (
      <Box>
        {cart.map((item) => {
          total += item.quantity * item.product.price;
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
            {total.toLocaleString("vi-VI", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        </HStack>
        <Button w="100%" mt={4} colorScheme="blue" onClick={() => onSubmit()}>
          Đặt hàng
        </Button>
      </Box>
    );
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={payload.isOpen}
      onClose={payload.onClose}
      size="5xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thanh toán</ModalHeader>
        <ModalBody pb={6}>
          <SimpleGrid columns={[1, 1, 3]} columnGap={10} spacing={10}>
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
                  defaultValue={userData?.firstName}
                />
              </FormControl>
              <FormControl mt={2}>
                <FormLabel>Tên</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Tên"
                  type="text"
                  disabled
                  defaultValue={userData?.lastName}
                />
              </FormControl>
              <FormControl mt={2}>
                <FormLabel>E-mail</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Tên"
                  type="text"
                  disabled
                  defaultValue={userData?.email}
                />
              </FormControl>
              <FormControl mt={2}>
                <FormLabel>Số điện thoại</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Tên"
                  type="text"
                  disabled
                  defaultValue={userData?.phonenumber}
                />
              </FormControl>
              <FormControl mt={2}>
                <FormLabel>Tỉnh/Thành phố</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Tên"
                  type="text"
                  disabled
                  defaultValue={userData?.city}
                />
              </FormControl>
              <FormControl mt={2}>
                <FormLabel>Địa chỉ</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Tên"
                  type="text"
                  disabled
                  defaultValue={userData?.address}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <Text fontSize="lg" fontWeight={600} mb={2}>
                Thanh toán
              </Text>
              <Stack direction="column">
                <RadioGroup
                  name="paymentType"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e)}
                >
                  <Radio name="paymentType" value="cash">
                    Thanh toán khi giao hàng
                  </Radio>
                  {paymentType === "cash" ? (
                    <Text fontSize="sm">
                      Bạn có thể nhận hàng và kiểm tra hàng rồi thanh toán 100%
                      giá trị đơn hàng cho đơn vị vận chuyển.
                    </Text>
                  ) : null}
                  <Radio value="transfer" mt={2}>
                    Chuyển khoản qua ngân hàng
                  </Radio>
                  {paymentType === "transfer" ? (
                    <Text fontSize="sm">
                      Quý khách có thể thanh toán chuyển khoản từ tài khoản cá
                      nhân của mình đến tài khoản của Cara Luna: <br />
                      ▪️ <b>NGÂN HÀNG</b>: Ngân hàng Thương Mại Cổ Phần Quân Đội
                      - MB Bank
                      <br /> ▪️ <b>CHỦ TÀI KHOẢN</b>: BUI THI THANH TAM ▪️ SỐ
                      TÀI KHOẢN: 8888803051986
                      <br /> ▪️ <b>NỘI DUNG</b> CK: Tên người chuyển_Số điện
                      thoại (Ví dụ: Tuấn Anh_096.456.999)
                      <br />
                      Sau khi bạn chuyển khoản xong, hoàn tất quá trình đặt đơn
                      hàng, Cara Luna sẽ tiếp nhận đơn hàng và liên hệ lại với
                      bạn qua số điện thoại bạn cung cấp!
                    </Text>
                  ) : null}
                </RadioGroup>
              </Stack>
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

export default UserInvoiceDetails;
