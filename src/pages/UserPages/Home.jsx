import {
  Box,
  GridItem,
  AspectRatio,
  Image,
  Text,
  Stack,
  VStack,
  SimpleGrid,
  Checkbox,
  Divider,
} from "@chakra-ui/react";
import { UserProductDetails } from "../../components/popup";
import React from "react";
import axios from "axios";
import { Pagination } from "../../components/common";
import { HiOutlineCube } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";

const subCategory = [
  {
    label: "Khoảng giá",
    value: "price",
    child: [
      {
        label: "Dưới 500.000đ",
        value: "0,500000",
      },
      {
        label: "Từ 500.000đ - 1 triệu",
        value: "500000,1000000",
      },
      {
        label: "Từ 1 triệu - 1.500.000đ",
        value: "1000000,1500000",
      },
      {
        label: "Từ 1.500.000đ - 2 triệu",
        value: "1500000,2000000",
      },
      {
        label: "Từ 2 triệu - 3 triệu",
        value: "2000000,3000000",
      },
      {
        label: "Từ 3 triệu - 5 triệu",
        value: "3000000,5000000",
      },
      {
        label: "Từ 5 triệu - 10 triệu",
        value: "5000000,10000000",
      },
      {
        label: "Trên 10 triệu",
        value: "10000000,1000000000",
      },
    ],
  },
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
  {
    label: "Dịp sử dụng",
    value: "event",
    child: [
      {
        label: "Everyday",
        value: "Every day",
      },
      {
        label: "Date night",
        value: "Date night",
      },

      {
        label: "Event",
        value: "Event",
      },
      {
        label: "Resort",
        value: "Resort",
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [meta, setMeta] = React.useState({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPage: 0,
  });
  const [payload, setPayload] = React.useState([]);
  const [product, setProduct] = React.useState(null);
  const [filter, setFilter] = React.useState({
    page: 1,
    limit: 10,
    keyword: "",
    size: "",
    event: "",
    style: "",
    material: "",
    categoryCode: "",
    subCategoryCode: "",
  });

  const fetchProduct = async (page, filterParams) => {
    const resolvePrice = {};
    if (filterParams.price) {
      const splitPrice = filterParams.price.split(",");
      Object.assign(resolvePrice, {
        priceFrom: splitPrice[0],
        priceTo: splitPrice[1],
      });
    }
    const response = await axios.get("http://localhost:8080/api/products", {
      params: {
        keyword: "",
        page,
        limit: 10,
        ...filterParams,
        ...resolvePrice,
      },
    });
    const { items, meta } = response.data.payload;
    setPayload(items);
    setMeta(meta);
  };

  React.useEffect(() => {
    fetchProduct();
  }, []);

  React.useEffect(() => {
    const keyword = searchParams.get("keyword") || "";
    const categoryCode = searchParams.get("categoryCode") || "";
    const subCategoryCode = searchParams.get("subCategoryCode") || "";
    const includesCategoryCode = ["DC", "VT", "NH", "HT"].includes(
      categoryCode
    );
    if (searchParams.has("subCategoryCode")) {
      searchParams.delete("subCategoryCode");
    }
    if (!categoryCode || !includesCategoryCode) {
      searchParams.set("categoryCode", "DC");
      setSearchParams(searchParams);
    }
    const newFilter = { ...filter, keyword, categoryCode, subCategoryCode };

    setFilter(newFilter);
    fetchProduct(1, newFilter);
  }, [searchParams]);

  const onFilter = (subCategory, childSub) => {
    const newFilter = {
      ...filter,
      [subCategory]: childSub,
    };
    setFilter(newFilter);
    fetchProduct(1, newFilter);
  };

  const _renderProduct = () =>
    payload.map((item) => (
      <GridItem
        key={`product-${item.id}`}
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
          fontSize="13px"
          fontWeight={600}
          lineHeight="22px"
          flex={1}
          padding="4px 4px"
        >
          {item.name}
        </Text>
        <Text
          color="#e8002d"
          lineHeight="23px"
          fontSize="15px"
          fontWeight={500}
          padding="4px 4px"
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
        <Stack flexDirection={["column", "column", "row"]}>
          <Stack w={["100%", "100%", "260px"]} marginRight="20px">
            <Text
              fontWeight={600}
              fontSize="md"
              textTransform="uppercase"
              background="#f7f8f9"
              padding="6px 10px"
            >
              Danh mục sản phẩm
            </Text>
            <Stack
              flexDirection={["row", "row", "column"]}
              flexWrap="wrap"
              boxShadow="base"
              padding="15px"
            >
              {subCategory.map((sub, index) => (
                <React.Fragment key={`sub-${sub.value}-${index}`}>
                  <Stack direction="column" minWidth="280px">
                    <Text
                      fontSize="md"
                      fontWeight={600}
                      textTransform="uppercase"
                    >
                      {sub?.label}
                    </Text>

                    {sub.child.map((item) => {
                      return (
                        <Checkbox
                          size="sm"
                          key={`option-${sub.value}-${item.value}`}
                          onChange={() =>
                            onFilter(
                              sub.value,
                              filter?.[sub.value] === item.value
                                ? ""
                                : item.value
                            )
                          }
                          isChecked={filter?.[sub.value] === item.value}
                          defaultChecked={false}
                        >
                          {item?.label}
                        </Checkbox>
                      );
                    })}
                  </Stack>
                  {index < subCategory.length ? (
                    <Divider margin="15px 0" />
                  ) : null}
                </React.Fragment>
              ))}
            </Stack>
          </Stack>
          <Stack flex={1} marginTop="0 !important">
            <Stack>
              <Text
                fontWeight={600}
                fontSize="md"
                textTransform="uppercase"
                background="#f7f8f9"
                padding="6px 10px"
              >
                {searchParams.get("categoryCode") &&
                ["DC", "VT", "NH", "HT"].includes(
                  searchParams.get("categoryCode")
                )
                  ? categoryOptions.find(
                      (item) => item.value === searchParams.get("categoryCode")
                    )?.label
                  : "Dây chuyền"}
              </Text>
            </Stack>
            {payload.length > 0 ? (
              <SimpleGrid columns={[1, 2, 3, 4]} gap={5}>
                {_renderProduct()}
              </SimpleGrid>
            ) : (
              <VStack padding="40px 20px">
                <HiOutlineCube size="100" />
                <Text>Không có sản phẩm nào được tìm thấy</Text>
              </VStack>
            )}
            <Pagination onClick={fetchProduct} meta={meta} />
          </Stack>
        </Stack>
      </Box>
    );
  };

  return <>{_renderProductSection()}</>;
};

export default Home;
