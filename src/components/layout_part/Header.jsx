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
  Input,
  Link,
  InputGroup,
  InputRightElement,
  Hide,
  Show,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
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
  HiOutlineRectangleStack,
  HiOutlineMagnifyingGlass,
  HiOutlineBars4,
} from "react-icons/hi2";
import React from "react";
import { InvoiceHistory, Profile, SignIn, SignUp } from "../popup";
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
import { useSearchParams } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

const navigation = [
  {
    label: "Menu",
    value: "menu",
    enable: false,
  },
  {
    label: "Product",
    value: "product",
    enable: true,
    child: [
      {
        label: "Dây chuyền",
        value: "DC",
        enable: true,
        subCategoryCode: [
          {
            label: "Choker",
            value: "DC_choker",
          },
          {
            label: "Chain Necklace",
            value: "DC_chainNecklace",
          },

          {
            label: "Pendant Necklace",
            value: "DC_pendantNecklace",
          },
          {
            label: "Statement Necklace",
            value: "DC_statementNecklace",
          },
          {
            label: "Chain Layering",
            value: "DC_chainLayering",
          },
        ],
      },
      {
        label: "Vòng tay",
        value: "VT",
        enable: true,
        subCategoryCode: [
          {
            label: "Bangle",
            value: "VT_bangle",
          },
          {
            label: "Chain Bracelet",
            value: "VT_chainBracelet",
          },

          {
            label: "Charm Bracelet",
            value: "VT_charmBracelet",
          },
          {
            label: "Bar Bracelet",
            value: "VT_barBracelet",
          },
          {
            label: "Bracelet Stacking",
            value: "VT_braceletStacking",
          },
        ],
      },
      {
        label: "Nhẫn",
        value: "NH",
        enable: true,
        subCategoryCode: [
          {
            label: "Statement Ring",
            value: "NH_statementRing",
          },
          {
            label: "Band Ring",
            value: "NH_bandRing",
          },

          {
            label: "Chain Ring",
            value: "NH_chainRing",
          },
          {
            label: "Dainty Ring",
            value: "NH_daintyRing",
          },
          {
            label: "Ring Stacking",
            value: "NH_ringStacking",
          },
          {
            label: "Signet Ring",
            value: "NH_signetRing",
          },
          {
            label: "Braided Ring",
            value: "NH_braidedRing",
          },
        ],
      },
      {
        label: "Hoa tai",
        value: "HT",
        enable: true,
        subCategoryCode: [
          {
            label: "Studs",
            value: "HT_studs",
          },
          {
            label: "Huggies",
            value: "HT_huggies",
          },

          {
            label: "Hoops",
            value: "HT_hoops",
          },
          {
            label: "Drops",
            value: "HT_drops",
          },
          {
            label: "Dangles",
            value: "HT_dangles",
          },
          {
            label: "Jacket Earrings",
            value: "HT_jacketErrings",
          },
          {
            label: "Ear Cuffs",
            value: "HT_earCuffs",
          },

          {
            label: "Statement Earrings",
            value: "HT_statementEarrings",
          },
          {
            label: "Ear Stacking",
            value: "HT_earStacking",
          },
          {
            label: "Climber Earings",
            value: "HT_climberEarings",
          },
          {
            label: "Cuff Earings",
            value: "HT_cuffEarings",
          },
        ],
      },
    ],
  },
  {
    label: "Gifts",
    value: "product",
    enable: false,
  },
  {
    label: "About Us",
    value: "aboutUs",
    enable: false,
  },
  {
    label: "Tin tức",
    value: "product",
    enable: false,
  },
];

const AccountButton = (payload) => {
  const [isShowSignInPopup, setIsShowSignInPopup] = React.useState(false);
  const [isShowSignUpPopup, setIsShowSignUpPopup] = React.useState(false);
  const [isShowInvoiceHistory, setIsSHowInvoiceHistory] = React.useState(false);
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

  const onInvoice = () => {
    onClose();
    setIsSHowInvoiceHistory(true);
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
      <InvoiceHistory
        isOpen={isShowInvoiceHistory}
        onClose={() => setIsSHowInvoiceHistory(false)}
      />

      <Popover
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        placement="bottom"
      >
        <PopoverTrigger>
          {token ? (
            <Button
              display="flex"
              flexDirection="column"
              variant="ghost"
              h="auto"
              p="5px"
            >
              <HStack border="1px solid black" padding="3px" borderRadius="50%">
                <Icon as={HiOutlineUser} />
              </HStack>
              <Text fontSize="xs" mt="6px">
                Hi, {userData.lastName}
              </Text>
            </Button>
          ) : (
            <Button
              display="flex"
              flexDirection="column"
              variant="ghost"
              h="auto"
              p="5px"
            >
              <HStack border="1px solid black" padding="3px" borderRadius="50%">
                <Icon as={HiOutlineUser} />
              </HStack>
              <Text fontSize="xs" mt="6px">
                Tài khoản
              </Text>
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent maxW="160px">
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
                onClick={() => onInvoice()}
              >
                <Icon as={HiOutlineRectangleStack} />
                <Text fontSize="xs" ml="6px">
                  Lịch sử mua hàng
                </Text>
              </Button>
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
            h="auto"
            p="5px"
          >
            <Badge rounded="full" p="2px" position="absolute" top={0} right={3}>
              {cart.length}
            </Badge>
            <HStack border="1px solid black" padding="3px" borderRadius="50%">
              <Icon as={HiOutlineShoppingBag} />
            </HStack>
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

const Navbar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = React.useState("");
  return (
    <VStack flex={1} padding="5px 20px 0px 20px" h="full">
      <InputGroup w="100%" maxW="400px" h="30px" alignItems="center">
        <Input
          placeholder="Tìm kiếm sản phẩm"
          size="sm"
          flex={1}
          borderRadius="5px"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <InputRightElement padding="0" h="100%" w="max-content">
          <IconButton
            size="xs"
            height="30px"
            width="30px"
            onClick={() => {
              if (!searchParams.has("keyword")) {
                searchParams.append("keyword", keyword);
              } else {
                searchParams.set("keyword", keyword);
              }
              setSearchParams(searchParams);
            }}
          >
            <HiOutlineMagnifyingGlass />
          </IconButton>
        </InputRightElement>
      </InputGroup>
      <Divider marginTop="5px" />
      <HStack w="100%" marginTop="0 !important" flex={1}>
        {navigation.map((item) => (
          <Stack
            key={item.value}
            flex={1}
            alignItems="center"
            flexDir="row"
            justifyContent="center"
            position="relative"
            h="100%"
            _hover={{
              cursor: "pointer",
              " .line": {
                width: "100%",
                left: 0,
                background: "#000",
              },
              " .menu": {
                opacity: 1,
                top: "100%",
                zIndex: 101,
              },
            }}
          >
            <Popover trigger="hover">
              <PopoverTrigger>
                <Text textTransform="uppercase" fontSize="sm">
                  {item?.label}
                </Text>
              </PopoverTrigger>
              {!item.enable ? (
                <PopoverContent>
                  <PopoverBody>
                    <Text
                      textTransform="uppercase"
                      fontSize="sm"
                      padding="6px 10px"
                    >
                      Trang này vẫn đang phát triển. Vui lòng quay lại sau!
                    </Text>
                  </PopoverBody>
                </PopoverContent>
              ) : null}
            </Popover>
            <Box
              className="line"
              bottom="0"
              height="2px"
              left="50%"
              position="absolute"
              background="#fff"
              transition="width 0.3s ease 0s, left 0.3s ease 0s"
              width="0px"
            />
            {item.enable ? (
              <Stack
                position="absolute"
                top="150%"
                marginTop="0 !important"
                background="#fff"
                w="full"
                h="auto"
                opacity={0}
                boxShadow="base"
                className="menu"
                transition="all ease 0.25s"
                userSelect="none"
                zIndex={-1}
              >
                {item?.child.map((childItem) => (
                  <Link
                    flex={1}
                    alignItems="center"
                    flexDir="row"
                    justifyContent="center"
                    position="relative"
                    key={`child-${childItem.value}`}
                    fontWeight={400}
                    _hover={{
                      " .child_label": {
                        background: "#71bec2",
                        color: "#fff",
                        cursor: "pointer",
                      },

                      " .sub_menu": {
                        opacity: 1,
                        top: "0",
                        zIndex: 101,
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (searchParams.has("subCategoryCode")) {
                        searchParams.delete("subCategoryCode");
                      }
                      searchParams.set("categoryCode", childItem.value);
                      setSearchParams(searchParams);
                    }}
                  >
                    <Text
                      textTransform="uppercase"
                      fontSize="sm"
                      padding="6px 10px"
                      className="child_label"
                    >
                      {childItem?.label}
                    </Text>
                    <Stack
                      position="absolute"
                      top="100%"
                      marginTop="0 !important"
                      background="#fff"
                      w="160px"
                      left="100%"
                      h="auto"
                      opacity={0}
                      boxShadow="base"
                      className="sub_menu"
                      transition="all ease 0.25s"
                      userSelect="none"
                      zIndex={-1}
                    >
                      {childItem?.subCategoryCode.map((subCategoryCode) => (
                        <Link
                          flex={1}
                          alignItems="center"
                          flexDir="row"
                          justifyContent="center"
                          position="relative"
                          key={`child-subcategory-${subCategoryCode.value}`}
                          fontWeight={400}
                          color="black"
                          _hover={{
                            cursor: "pointer",
                            background: "#71bec2",
                            color: "#fff",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            searchParams.set("categoryCode", childItem.value);
                            searchParams.set(
                              "subCategoryCode",
                              subCategoryCode.value
                            );
                            setSearchParams(searchParams);
                          }}
                        >
                          <Text
                            textTransform="uppercase"
                            fontSize="sm"
                            padding="6px 10px"
                          >
                            {subCategoryCode?.label}
                          </Text>
                        </Link>
                      ))}
                    </Stack>
                  </Link>
                ))}
              </Stack>
            ) : null}
          </Stack>
        ))}
      </HStack>
    </VStack>
  );
};

const MobileNavbar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = React.useState("");
  return (
    <VStack flex={1} padding="5px 5px 0px 5px" h="full" alignItems="flex-start">
      <InputGroup w="100%" maxW="400px" h="30px" alignItems="center">
        <Input
          placeholder="Tìm kiếm sản phẩm"
          size="sm"
          flex={1}
          borderRadius="5px"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <InputRightElement padding="0" h="100%" w="max-content">
          <IconButton
            size="xs"
            height="30px"
            width="30px"
            onClick={() => {
              if (!searchParams.has("keyword")) {
                searchParams.append("keyword", keyword);
              } else {
                searchParams.set("keyword", keyword);
              }
              setSearchParams(searchParams);
            }}
          >
            <HiOutlineMagnifyingGlass />
          </IconButton>
        </InputRightElement>
      </InputGroup>
      <Divider margin="20px 0" />
      <Accordion allowToggle w="full">
        {navigation.map((item) => (
          <AccordionItem
            key={item.value}
            flex={1}
            alignItems="center"
            flexDir="row"
            justifyContent="center"
            position="relative"
            _hover={{
              cursor: "pointer",
            }}
          >
            <Popover trigger="hover">
              <PopoverTrigger>
                <AccordionButton
                  textTransform="uppercase"
                  fontSize="sm"
                  justifyContent="space-between"
                >
                  {item?.label}
                  {item.enable ? <AccordionIcon /> : null}
                </AccordionButton>
              </PopoverTrigger>
              {!item.enable ? (
                <PopoverContent>
                  <PopoverBody>
                    <Text textTransform="uppercase" fontSize="sm">
                      Trang này vẫn đang phát triển. Vui lòng quay lại sau!
                    </Text>
                  </PopoverBody>
                </PopoverContent>
              ) : null}
            </Popover>
            <AccordionPanel>
              {item.enable ? (
                <Accordion
                  marginTop="0 !important"
                  background="#fff"
                  boxShadow="base"
                  className="menu"
                  transition="all ease 0.25s"
                  userSelect="none"
                  allowToggle
                >
                  {item?.child.map((childItem) => (
                    <AccordionItem key={`child-${childItem.value}`}>
                      <Link
                        flex={1}
                        alignItems="center"
                        flexDir="row"
                        justifyContent="center"
                        position="relative"
                        fontWeight={400}
                        _hover={{
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (searchParams.has("subCategoryCode")) {
                            searchParams.delete("subCategoryCode");
                          }
                          searchParams.set("categoryCode", childItem.value);
                          setSearchParams(searchParams);
                        }}
                      >
                        <AccordionButton
                          textTransform="uppercase"
                          fontSize="sm"
                          justifyContent="space-between"
                        >
                          {childItem?.label}
                          {item.enable ? <AccordionIcon /> : null}
                        </AccordionButton>
                      </Link>
                      <AccordionPanel>
                        <Accordion
                          marginTop="0 !important"
                          background="#fff"
                          boxShadow="base"
                          className="sub_menu"
                          transition="all ease 0.25s"
                          userSelect="none"
                          allowToggle
                        >
                          {childItem?.subCategoryCode.map((subCategoryCode) => (
                            <AccordionItem
                              key={`child-subcategory-${subCategoryCode.value}`}
                            >
                              <Link
                                flex={1}
                                alignItems="center"
                                flexDir="row"
                                justifyContent="center"
                                position="relative"
                                fontWeight={400}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  searchParams.set(
                                    "categoryCode",
                                    childItem.value
                                  );
                                  searchParams.set(
                                    "subCategoryCode",
                                    subCategoryCode.value
                                  );
                                  setSearchParams(searchParams);
                                }}
                              >
                                <AccordionButton
                                  textTransform="uppercase"
                                  fontSize="sm"
                                  textAlign="left"
                                  justifyContent="space-between"
                                >
                                  {subCategoryCode?.label}
                                </AccordionButton>
                              </Link>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : null}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </VStack>
  );
};

const Header = () => {
  const [isShowInvoice, setIsShowInvoice] = React.useState(false);
  const [isShowProfile, setIsShowProfile] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  return (
    <Box as="nav" boxShadow="base" h="80px" display="flex" alignItems="center">
      <UserInvoiceDetails
        isOpen={isShowInvoice}
        onClose={() => setIsShowInvoice(false)}
      />
      <Profile isOpen={isShowProfile} onClose={() => setIsShowProfile(false)} />

      <Container
        maxW="1280px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="0 24px"
        h="full"
      >
        <Image src={logo} alt="Logo" />
        <Hide below="900px">
          <Navbar display={["none", "none", "flex"]} />
        </Hide>
        <HStack>
          <AccountButton onProfile={() => setIsShowProfile(true)} />
          <CartButton onInvoice={() => setIsShowInvoice(true)} />
          <Show below="900px">
            <Button
              display="flex"
              flexDirection="column"
              variant="ghost"
              h="auto"
              p="5px"
              ref={btnRef}
              onClick={onOpen}
            >
              <HStack border="1px solid black" padding="3px" borderRadius="50%">
                <Icon as={HiOutlineBars4} />
              </HStack>
              <Text fontSize="xs" mt="6px">
                Menu
              </Text>
            </Button>
          </Show>
        </HStack>
      </Container>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <MobileNavbar />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
