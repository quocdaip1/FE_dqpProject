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

const extraSubCategory = {
  DC: {
    label: "Kiểu dáng",
    value: "event",
    child: [
      {
        label: "Choker",
        value: "choker",
      },
      {
        label: "Chain Necklace",
        value: "chainNecklace",
      },

      {
        label: "Pendant Necklace",
        value: "pendantNecklace",
      },
      {
        label: "Statement Necklace",
        value: "statementNecklace",
      },
      {
        label: "Chain Layering",
        value: "chainLayering",
      },
    ],
  },
  VT: {
    label: "Kiểu dáng",
    value: "event",
    child: [
      {
        label: "Bangle",
        value: "bangle",
      },
      {
        label: "Chain Bracelet",
        value: "chainBracelet",
      },

      {
        label: "Charm Bracelet",
        value: "charmBracelet",
      },
      {
        label: "Bar Bracelet",
        value: "barBracelet",
      },
      {
        label: "Bracelet Stacking",
        value: "braceletStacking",
      },
    ],
  },
  NH: {
    label: "Kiểu dáng",
    value: "event",
    child: [
      {
        label: "Statement Ring",
        value: "statementRing",
      },
      {
        label: "Band Ring",
        value: "bandRing",
      },

      {
        label: "Chain Ring",
        value: "chainRing",
      },
      {
        label: "Dainty Ring",
        value: "daintyRing",
      },
      {
        label: "Ring Stacking",
        value: "ringStacking",
      },
      {
        label: "Signet Ring",
        value: "signetRing",
      },
      {
        label: "Braided Ring",
        value: "braidedRing",
      },
    ],
  },
  HT: {
    label: "Kiểu dáng",
    value: "event",
    child: [
      {
        label: "Studs",
        value: "studs",
      },
      {
        label: "Huggies",
        value: "huggies",
      },

      {
        label: "Hoops",
        value: "hoops",
      },
      {
        label: "Drops",
        value: "drops",
      },
      {
        label: "Dangles",
        value: "dangles",
      },
      {
        label: "Jacket Earrings",
        value: "jacketErrings",
      },
      {
        label: "Ear Cuffs",
        value: "earCuffs",
      },

      {
        label: "Statement Earrings",
        value: "statementEarrings",
      },
      {
        label: "Ear Stacking",
        value: "earStacking",
      },
      {
        label: "Climber Earings",
        value: "climberEarings",
      },
      {
        label: "Cuff Earings",
        value: "cuffEarings",
      },
    ],
  },
};

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
    setPayload(items);
    setMeta(meta);
  };

  React.useEffect(() => {
    fetchProduct();
  }, []);

  React.useEffect(() => {
    const keyword = searchParams.get("keyword") || "";
    const categoryCode = searchParams.get("categoryCode") || "";
    const includesCategoryCode = ["DC", "VT", "NH", "HT"].includes(
      categoryCode
    );
    if (!categoryCode || !includesCategoryCode) {
      searchParams.set("categoryCode", "DC");
      setSearchParams(searchParams);
    }
    const newFilter = { ...filter, keyword, categoryCode };

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

  const resolveSubCategory = React.useMemo(() => {
    const categoryCode =
      (searchParams.get("categoryCode") && searchParams.get("categoryCode")) ||
      "DC";
    const resolveCategoryCode = ["DC", "VT", "NH", "HT"].includes(categoryCode)
      ? categoryCode
      : "DC";
    const result = [...subCategory];
    const findExtraSubCategory = extraSubCategory[resolveCategoryCode];
    result.push(findExtraSubCategory);
    return result;
  }, [searchParams]);

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
              {resolveSubCategory.map((sub, index) => (
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
