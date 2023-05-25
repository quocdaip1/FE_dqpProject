import React from "react";

import {
  AspectRatio,
  Button,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { selectCart, setCart } from "../../../cartSlice";
import { setCartCookies } from "../../../lib/utils";

const UserProductDetails = (payload) => {
  const { cart } = useSelector(selectCart);
  const dispatch = useDispatch();

  const [qty, setQty] = React.useState(1);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const onAddToCart = () => {
    const findCart = cart.find(
      (item) => item.product.id === payload.product.id
    );
    const resolveCart = [];
    if (findCart) {
      resolveCart.push(
        ...cart.map((item) => {
          if (item.product.id === payload.product.id)
            return {
              ...item,
              quantity: item.quantity + qty,
            };
        })
      );
    } else
      resolveCart.push(
        ...[...cart, { quantity: qty, product: payload.product }]
      );
    dispatch(setCart(resolveCart));
    setCartCookies(resolveCart);
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={payload.isOpen}
      onClose={payload.onClose}
      size="2xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết sản phẩm</ModalHeader>
        <ModalBody pb={6}>
          <HStack alignItems="unset">
            <AspectRatio
              flex={1}
              maxW="100%"
              ratio={1}
              bg="rgba(0,0,0,0.1)"
              mr={2}
            >
              <Image
                src={payload?.product?.image}
                alt={payload?.product?.name}
                objectFit="cover"
                className="first_thumb"
              />
            </AspectRatio>
            <Stack flex={1} alignItems="flex-start">
              <Text fontSize="2xl" fontWeight={600}>
                {payload.product?.name}
              </Text>
              <Text fontSize="xl" fontWeight={700} color="red">
                {payload.product?.price.toLocaleString("vi-VI", {
                  style: "currency",
                  currency: "VND",
                })}
              </Text>
              <Text>{payload.product?.description}</Text>
              <HStack>
                <NumberInput
                  defaultValue={1}
                  min={1}
                  max={10}
                  maxW="70px"
                  value={qty}
                  onChange={(_vAS, vAN) => setQty(vAN)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Button onClick={() => onAddToCart()}>Thêm vào giỏ hàng</Button>
              </HStack>
            </Stack>
          </HStack>
          <Stack mt={2}>
            <TableContainer>
              <Table variant="simple">
                <Tbody>
                  <Tr>
                    <Th>Mã sản phẩm</Th>
                    <Td>{payload.product?.code}</Td>
                  </Tr>
                  <Tr>
                    <Th>Loại</Th>
                    <Td>{payload.product?.categoryCode}</Td>
                  </Tr>
                  <Tr>
                    <Th>Kích cỡ</Th>
                    <Td>{payload.product?.size}</Td>
                  </Tr>
                  <Tr>
                    <Th>Chất liệu</Th>
                    <Td>{payload.product?.material}</Td>
                  </Tr>
                  <Tr>
                    <Th>Phong cách</Th>
                    <Td>{payload.product?.style}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={payload.onClose}>Đóng</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserProductDetails;
