import {
  Box,
  GridItem,
  AspectRatio,
  Image,
  Text,
  Stack,
  TabIndicator,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  List,
  ListItem,
  Button,
  Icon,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { UserProductDetails } from "../../components/popup";
import React from "react";
import axios from "axios";
import { Pagination } from "../../components/common";
import { Tabs, TabList, Tab } from "@chakra-ui/react";
import { HiOutlineChevronRight, HiOutlineCube } from "react-icons/hi2";

const subCategory = [
  {
    label: "Chất liệu",
    value: "material",
    child: [
      {
        label: "Bạc Ý 925",
        value: "bacY925",
      },
      {
        label: "Ngọc Trai",
        value: "ngocTrai",
      },
      {
        label: "Đá CZ",
        value: "daCZ",
      },
    ],
  },
  {
    label: "Kích thước",
    value: "size",
    child: [
      {
        label: "Nhỏ",
        value: "small",
      },
      {
        label: "Trung",
        value: "medium",
      },

      {
        label: "Lớn",
        value: "big",
      },
    ],
  },
  {
    label: "Phong cách",
    value: "style",
    child: [
      {
        label: "Sweet Korean",
        value: "sweetKorean",
      },
      {
        label: "Cool Minimalist",
        value: "coolMinimalist",
      },

      {
        label: "Preppy Laddy",
        value: "preppyLaddy",
      },
      {
        label: "Modern Classic",
        value: "modernClassic",
      },
      {
        label: "Gifts",
        value: "gifts",
      },
    ],
  },
];

const categoryOptions = [
  {
    label: "Dây chuyền",
    value: "DC",
  },
  {
    label: "Vòng tay",
    value: "VT",
  },
  {
    label: "Nhẫn",
    value: "NH",
  },
  {
    label: "Hoa tai",
    value: "HT",
  },
];

const Home = () => {
  const [meta, setMeta] = React.useState({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPage: 0,
  });
  const [payload, setPayload] = React.useState([]);
  const [product, setProduct] = React.useState(null);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [filter, setFilter] = React.useState({
    size: "",
    style: "",
    material: "",
    categoryCode: "",
  });

  const fetchProduct = async (page, filterParams) => {
    const response = await axios.get("http://localhost:8080/api/products", {
      params: {
        keyword: "",
        page,
        limit: 10,
        ...filterParams,
      },
    });
    const { items, meta } = response.data.payload;
    setMeta(meta);
    setPayload(items);
  };

  React.useEffect(() => {
    fetchProduct(1, filter);
  }, []);

  const onFilter = async (category, subCategory, childSub) => {
    const newFilter = {
      ...filter,
      size: "",
      style: "",
      material: "",
      categoryCode: category,
    };
    if (childSub && subCategory) newFilter[subCategory] = childSub;

    await setFilter(newFilter);
    fetchProduct(1, newFilter);
  };

  const _renderCategoryBar = () => {
    return (
      <Stack padding="10px">
        <Tabs position="relative" variant="unstyled" index={tabIndex}>
          <TabList _focusVisible={false} boxShadow="none">
            {categoryOptions.map((category, categoryIndex) => (
              <Popover
                trigger="hover"
                placement="bottom-start"
                key={`category-${category.label}`}
              >
                <PopoverTrigger>
                  <Tab
                    outline={0}
                    border={0}
                    boxShadow="none"
                    _focus={{ boxShadow: "none", outline: "none" }}
                    onClick={() => {
                      setTabIndex(categoryIndex);
                      onFilter(category.value, "", "");
                    }}
                  >
                    {category.label}
                  </Tab>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverBody padding={0}>
                    <List spacing={3}>
                      {subCategory.map((sub) => (
                        <ListItem key={`sub-${sub.label}-${category.label}`}>
                          <ListItem>
                            <Popover trigger="hover" placement="right-start">
                              <PopoverTrigger>
                                <Button
                                  variant="ghost"
                                  w="98%"
                                  textAlign="left"
                                  justifyContent="space-between"
                                  rightIcon={
                                    <Icon as={HiOutlineChevronRight} />
                                  }
                                >
                                  {sub.label}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent>
                                <PopoverBody padding={0}>
                                  <List spacing={3}>
                                    {sub.child.map((item) => (
                                      <ListItem
                                        key={`child-sub-${item.value}-${sub.label}-${category.label}`}
                                      >
                                        <Button
                                          variant="ghost"
                                          w="100%"
                                          textAlign="left"
                                          justifyContent="space-between"
                                          onClick={() => {
                                            setTabIndex(categoryIndex);
                                            onFilter(
                                              category.value,
                                              sub.value,
                                              item.value
                                            );
                                          }}
                                        >
                                          {item.label}
                                        </Button>
                                      </ListItem>
                                    ))}
                                  </List>
                                </PopoverBody>
                              </PopoverContent>
                            </Popover>
                          </ListItem>
                        </ListItem>
                      ))}
                    </List>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            ))}
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="blue.500"
            borderRadius="1px"
          />
        </Tabs>
      </Stack>
    );
  };

  const _renderProduct = () =>
    payload.map((item, index) => (
      <GridItem
        key={`product ${index}`}
        w="100%"
        h="auto"
        display="flex"
        flexDirection="column"
        _hover={{
          cursor: "pointer",
          boxShadow: "base",
          padding: "10px",
          transition: "all ease 0.25s",
        }}
        onClick={() => setProduct(item)}
      >
        <AspectRatio maxW="100%" ratio={1} bg="rgba(0,0,0,0.1)">
          <Image
            src={item.image}
            alt={item.name}
            objectFit="cover"
            className="first_thumb"
          />
        </AspectRatio>
        <Text
          fontSize="14px"
          fontWeight={600}
          lineHeight="22px"
          flex={1}
          padding="8px 4px"
        >
          {item.name}
        </Text>
        <Text
          color="#e8002d"
          lineHeight="23px"
          fontSize="16px"
          fontWeight={700}
          padding="8px 4px"
        >
          {item.price.toLocaleString("vn-VI", {
            style: "currency",
            currency: "VND",
          })}
        </Text>
      </GridItem>
    ));

  const _renderProductSection = () => {
    return (
      <Box as="section" flex={1}>
        <UserProductDetails
          isOpen={Boolean(product)}
          onClose={() => setProduct(null)}
          product={product}
        />
        {_renderCategoryBar()}
        {payload.length > 0 ? (
          <SimpleGrid columns={[1, 2, 3, 4]} gap={5} flex={1}>
            {_renderProduct()}
          </SimpleGrid>
        ) : (
          <VStack padding="40px 20px">
            <HiOutlineCube size="100" />
            <Text>Không có sản phẩm nào được tìm thấy</Text>
          </VStack>
        )}
      </Box>
    );
  };

  return (
    <>
      {_renderProductSection()}
      <Pagination onClick={fetchProduct} meta={meta} />
    </>
  );
};

export default Home;
