import {
  Box,
  Container,
  HStack,
  Image,
  Icon,
  Text,
  Button,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  useDisclosure,
  PopoverHeader,
  PopoverBody,
  Stack,
  AspectRatio,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import logo from "../../assets/logo.webp";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiOutlineUserPlus,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineArrowRightOnRectangle,
  HiOutlineChartBarSquare,
  HiOutlineXMark,
} from "react-icons/hi2";
import React from "react";
import { Profile, SignIn, SignUp } from "../popup";
import {
  clearCookie,
  getToken,
  getUserData,
  setCartCookies,
} from "../../lib/utils";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { selectCart, setCart } from "../../cartSlice";
import UserInvoiceDetails from "../popup/UserInvoiceDetails";

const AccountButton = (payload) => {
  const [isShowSignInPopup, setIsShowSignInPopup] = React.useState(false);
  const [isShowSignUpPopup, setIsShowSignUpPopup] = React.useState(false);
  const { onOpen, onClose, isOpen } = useDisclosure();

  const onSignIn = () => {
    onClose();
    setIsShowSignInPopup(true);
  };

  const onSignUp = () => {
    onClose();
    setIsShowSignUpPopup(true);
  };

  const onSignOut = () => {
    onClose();
    clearCookie();
  };
  const navigate = useNavigate();

  const token = getToken();
  const userData = getUserData();
  return (
    <>
      <SignIn
        isOpen={isShowSignInPopup}
        onClose={() => setIsShowSignInPopup(false)}
      />
      <SignUp
        isOpen={isShowSignUpPopup}
        onClose={() => {
          setIsShowSignUpPopup(false);
          setIsShowSignInPopup(true);
        }}
      />

      <Popover
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        placement="bottom"
      >
        <PopoverTrigger>
          {token ? (
            <Button display="flex" flexDirection="column" variant="ghost">
              <Icon as={HiOutlineUser} />
              <Text fontSize="xs" mt="6px">
                Hi, {userData.firstName} {userData.lastName}
              </Text>
            </Button>
          ) : (
            <Button display="flex" flexDirection="column" variant="ghost">
              <Icon as={HiOutlineUser} />
              <Text fontSize="xs" mt="6px">
                Tài khoản
              </Text>
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent maxW="200px">
          <PopoverArrow />
          {token ? (
            <>
              {userData?.role?.roleCode === "admin" ? (
                <Button
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  variant="ghost"
                  onClick={() => navigate("/quan-ly/bang-dieu-khien")}
                >
                  <Icon as={HiOutlineChartBarSquare} />
                  <Text fontSize="xs" ml="6px">
                    Trang quản lý
                  </Text>
                </Button>
              ) : null}
              {userData?.role?.roleCode === "user" ? (
                <Button
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  variant="ghost"
                  onClick={() => payload.onProfile()}
                >
                  <Icon as={HiOutlineChartBarSquare} />
                  <Text fontSize="xs" ml="6px">
                    Hồ sơ
                  </Text>
                </Button>
              ) : null}
              <Button
                display="flex"
                flexDirection="row"
                alignItems="center"
                variant="ghost"
                onClick={() => onSignOut()}
              >
                <Icon as={HiOutlineArrowRightOnRectangle} />
                <Text fontSize="xs" ml="6px">
                  Đăng xuất
                </Text>
              </Button>
            </>
          ) : (
            <>
              <Button
                display="flex"
                flexDirection="row"
                alignItems="center"
                variant="ghost"
                onClick={() => onSignIn()}
              >
                <Icon as={HiOutlineArrowLeftOnRectangle} />
                <Text fontSize="xs" ml="6px">
                  Đăng nhập
                </Text>
              </Button>
              <Button
                display="flex"
                flexDirection="row"
                alignItems="center"
                variant="ghost"
                onClick={() => onSignUp()}
              >
                <Icon as={HiOutlineUserPlus} />
                <Text fontSize="xs" ml="6px">
                  Đăng ký
                </Text>
              </Button>
            </>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};

const CartButton = (payload) => {
  const dispatch = useDispatch();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { cart } = useSelector(selectCart);
  const userData = getUserData();
  const token = getToken();

  const _renderEmpty = () => <Text>Không có sản phẩm trong giỏ hàng</Text>;

  const onChangeProduct = (id, value) => {
    const newCart = cart.map((item) => {
      if (item.product.id === id)
        return {
          ...item,
          quantity: value,
        };
      return item;
    });
    dispatch(setCart(newCart));
    setCartCookies(newCart);
  };

  const onRemove = (id) => {
    const newCart = cart.filter((item) => item.product.id !== id);
    dispatch(setCart(newCart));
    setCartCookies(newCart);
  };

  const _renderProduct = () => {
    let total = 0;

    let isDisabled = false;
    let tooltipLabel = "";
    if (!token) {
      isDisabled = true;
      tooltipLabel = "Vui lòng đăng nhập trước khi thanh toán";
    } else if (!userData.address || !userData.city) {
      isDisabled = true;
      tooltipLabel = "Vui lòng cập nhật thông tin cá nhân trước khi thanh toán";
    }

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
                <VStack flex={1}>
                  <HStack w="100%">
                    <Text fontSize="md" fontWeight={500} flex={1}>
                      {item.product.name}
                    </Text>
                    <IconButton
                      size="xs"
                      onClick={() => onRemove(item.product.id)}
                    >
                      <HiOutlineXMark />
                    </IconButton>
                  </HStack>
                  <HStack w="100%" flex={1} justifyContent="space-between">
                    <NumberInput
                      size="sm"
                      maxW={20}
                      min={1}
                      max={10}
                      value={item.quantity}
                      onChange={(_vAS, vAN) =>
                        onChangeProduct(item.product.id, vAN)
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <Text
                      fontSize="md"
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
        <Tooltip label={tooltipLabel}>
          <Button
            w="100%"
            mt={4}
            colorScheme="blue"
            isDisabled={isDisabled}
            onClick={() => {
              if (token) {
                onClose();
                payload.onInvoice();
              }
            }}
          >
            Thanh toán
          </Button>
        </Tooltip>
      </Box>
    );
  };

  return (
    <>
      <Popover
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        placement="bottom-end"
        closeOnBlur
      >
        <PopoverTrigger>
          <Button
            display="flex"
            flexDirection="column"
            variant="ghost"
            position="relative"
          >
            <Badge rounded="full" p="2px" position="absolute" top={0} right={5}>
              {cart.length}
            </Badge>
            <Icon as={HiOutlineShoppingBag} />
            <Text fontSize="xs" mt="6px">
              Giỏ hàng
            </Text>
          </Button>
        </PopoverTrigger>
        <PopoverContent maxW="400px">
          <PopoverArrow />
          <PopoverHeader>Giỏ hàng</PopoverHeader>
          <PopoverBody p="10px">
            {cart.length === 0 ? _renderEmpty() : _renderProduct()}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

const Header = () => {
  const [isShowInvoice, setIsShowInvoice] = React.useState(false);
  const [isShowProfile, setIsShowProfile] = React.useState(false);
  return (
    <Box as="nav" boxShadow="base" h="60px" display="flex" alignItems="center">
      <UserInvoiceDetails
        isOpen={isShowInvoice}
        onClose={() => setIsShowInvoice(false)}
      />
      <Profile isOpen={isShowProfile} onClose={() => setIsShowProfile(false)} />
      <Container
        maxW="880px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="0 24px"
      >
        <Image src={logo} alt="Logo" />
        <HStack>
          <AccountButton onProfile={() => setIsShowProfile(true)} />
          <CartButton onInvoice={() => setIsShowInvoice(true)} />
        </HStack>
      </Container>
    </Box>
  );
};

export default Header;
