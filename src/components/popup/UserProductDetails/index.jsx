import React from "react";

import {
  AspectRatio,
  Box,
  Button,
  GridItem,
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
  SimpleGrid,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Tr,
} from "@chakra-ui/react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { selectCart, setCart } from "../../../cartSlice";
import {
  getToken,
  getUserData,
  setCartCookies,
  setUserData,
} from "../../../lib/utils";
import { Rating } from "../../common";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "@chakra-ui/react";

const schema = yup
  .object({
    rating: yup.number().required("Rating là trường bắt buộc!"),
    comment: yup.string().required("Đánh giá là trường bắt buộc!"),
  })
  .required();

const UserProductDetails = (payload) => {
  const { cart } = useSelector(selectCart);
  const dispatch = useDispatch();

  const [qty, setQty] = React.useState(1);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  // const [isRated, setIsRated] = React.useState(false);
  let isRated = false;
  const userData = getUserData();
  const [savedProduct, setSavedProduct] = React.useState([]);
  const token = getToken();

  const toast = useToast();

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
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

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

  const submitRating = (data) => {
    axios
      .post(
        "http://localhost:8080/api/rattings",
        {
          ...data,
          productId: payload.product.id,
        },
        {
          headers: {
            "x-access-token": getToken(),
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          payload.onFetch();
          reset({
            rating: 1,
            comment: "",
          });
        }
      })
      .catch((e) => {
        toast({
          title: e.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const onSaveBookMark = (isRemove) => {
    if (!isRemove)
      axios
        .post(
          "http://localhost:8080/api/bookmark",
          {
            productCode: payload.product.code,
          },
          {
            headers: {
              "x-access-token": getToken(),
            },
          }
        )
        .then(async (response) => {
          if (response.status === 200) {
            getUserFav();
          }
        })
        .catch((e) => {
          toast({
            title: e.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    else
      axios
        .put(
          "http://localhost:8080/api/bookmark/" +
            _.find(savedProduct, ["productId", payload.product?.id])?.id,
          {
            productCode: payload.product.code,
          },
          {
            headers: {
              "x-access-token": getToken(),
            },
          }
        )
        .then(async (response) => {
          if (response.status === 200) {
            getUserFav();
          }
        })
        .catch((e) => {
          toast({
            title: e.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={payload.isOpen}
      onClose={payload.onClose}
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết sản phẩm</ModalHeader>
        <ModalBody pb={6}>
          <SimpleGrid columns={3} spacing={2}>
            <GridItem colStart={1} colEnd={3}>
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
                    {payload.product?.name} ({payload.product?.rate || 0} / 5)
                  </Text>
                  <Rating
                    size={10}
                    scale={5}
                    disabled
                    value={payload.product?.rate}
                  />
                  <Text fontSize="xl" fontWeight={700} color="red">
                    {payload.product?.price.toLocaleString("vi-VI", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Text>
                  <Text>{payload.product?.description}</Text>
                  <Text
                    fontSize="2xl"
                    color="red"
                    marginBottom="24px"
                    fontWeight={600}
                  >
                    {payload?.product?.quantity <= 0
                      ? "Sản phẩm đã hết hàng, vui lòng quay lại vào ngày khác"
                      : "Số lượng sản phẩm hiện có: " +
                        payload?.product?.quantity}
                  </Text>
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

                    <Button
                      onClick={() => onAddToCart()}
                      isDisabled={payload?.product?.quantity <= 0}
                    >
                      Thêm vào giỏ hàng
                    </Button>
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
            </GridItem>
            <GridItem>
              <Box boxShadow="base" padding="10px" borderRadius="10px">
                <Text fontSize="md" fontWeight={600} mb={2}>
                  Bình luận người khác
                </Text>
                <Box width="100%" maxHeight="300px" overflowY="auto">
                  {payload?.product?.rattings?.length > 0 ? (
                    payload?.product?.rattings.map((item) => {
                      if (item.user.id === userData.id) {
                        isRated = true;
                      }
                      return (
                        <Stack
                          key={item.id}
                          border="1px solid rgba(0,0,0,0.3)"
                          padding="10px"
                          borderRadius="12px"
                          marginBottom="10px"
                        >
                          <Text>
                            {item.user.firstName} {item.user.lastName}
                          </Text>
                          <Stack
                            flexDir="row"
                            alignItems="center"
                            justifyContent="space-between"
                            marginTop="0 !important"
                          >
                            <Rating
                              size={10}
                              scale={5}
                              disabled
                              value={item.rating}
                            />
                            <Text fontSize="sm" marginTop="0px !important">
                              {new Date(item.createdAt).toLocaleString()}
                            </Text>
                          </Stack>

                          <Text>{item.comment}</Text>
                        </Stack>
                      );
                    })
                  ) : (
                    <Text>Không có bình luận!</Text>
                  )}
                </Box>
              </Box>
              {isRated ? (
                <Text marginTop="10px">Bạn đã đánh giá sản phẩm này!</Text>
              ) : (
                <Box
                  as="form"
                  onSubmit={handleSubmit(submitRating)}
                  boxShadow="base"
                  padding="10px"
                  borderRadius="10px"
                  marginTop="10px"
                >
                  <Text fontSize="md" fontWeight={600}>
                    Đánh giá
                  </Text>
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                      <Rating size={10} scale={5} {...field} />
                    )}
                  />
                  {errors.rating?.message ? (
                    <Text fontSize="sm" color="red" marginTop="5px">
                      {errors.rating?.message}
                    </Text>
                  ) : null}
                  <Controller
                    name="comment"
                    control={control}
                    render={({ field }) => (
                      <Textarea placeholder="Đánh giá" mt={2} {...field} />
                    )}
                  />
                  {errors.comment?.message ? (
                    <Text fontSize="sm" color="red" marginTop="5px">
                      {errors.comment?.message}
                    </Text>
                  ) : null}
                  <Stack alignItems="flex-end">
                    {token ? (
                      <Button
                        w="max-content"
                        type="submit"
                        colorScheme="blue"
                        mt="2"
                        isDisabled={payload?.product?.quantity <= 0}
                      >
                        Đánh giá
                      </Button>
                    ) : (
                      <Button
                        w="max-content"
                        colorScheme="blue"
                        mt="2"
                        isDisabled
                      >
                        Vui lòng đăng nhập để đánh giá
                      </Button>
                    )}
                  </Stack>
                </Box>
              )}
            </GridItem>
          </SimpleGrid>
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={() =>
              onSaveBookMark(
                _.find(savedProduct, ["productId", payload.product?.id])
              )
            }
            isDisabled={payload?.product?.quantity <= 0}
            mr="3"
            color="orange"
          >
            {_.find(savedProduct, ["productId", payload.product?.id])
              ? "Bỏ yêu thích"
              : "Thêm vào yêu thích"}
          </Button>
          <Button onClick={payload.onClose}>Đóng</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserProductDetails;
