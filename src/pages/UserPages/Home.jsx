import {
  Box,
  Grid,
  GridItem,
  AspectRatio,
  Image,
  Text,
} from "@chakra-ui/react";
import firstThumb from "../../assets/product-1.png";
import secondThumb from "../../assets/product-2.png";
import thirdThumb from "../../assets/product-3.png";
import fourthThumb from "../../assets/product-4.png";
import { SignIn, SignUp, UserProductDetails } from "../../components/popup";
import React from "react";
import axios from "axios";
const examplePayload = [
  {
    name: "Dây Chuyền Bạc 925 Đính Đá Shine Bright - VCN06",
    price: 590000,
    thumb: firstThumb,
    secondThumb: fourthThumb,
  },
  {
    name: "Dây Chuyền Bạc 925 Xích Chữ Nhật Và Chuỗi Hạt Trai Tự Nhiên",
    price: 1590000,
    thumb: secondThumb,
    secondThumb: firstThumb,
  },
  {
    name: "Dây Chuyền Bạc 925 Đính Đá Ngọc Trai Tự Nhiên - VCN05",
    price: 590000,
    thumb: thirdThumb,
    secondThumb: secondThumb,
  },
  {
    name: "Dây Chuyền Bạc 925 Crystal Heart",
    price: 120000,
    thumb: fourthThumb,
    secondThumb: firstThumb,
  },
];

const Home = () => {
  const [keyword, setKeyword] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [meta, setMeta] = React.useState({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPage: 0,
  });
  const [payload, setPayload] = React.useState([]);
  const [product, setProduct] = React.useState(null);

  const fetchProduct = async (page) => {
    const response = await axios.get("http://localhost:8080/api/products", {
      params: {
        keyword,
        status,
        page,
        limit: 10,
      },
    });
    const { items, meta } = response.data.payload;
    setMeta(meta);
    setPayload(items);
  };

  React.useEffect(() => {
    fetchProduct(1);
  }, []);
  const _renderPopup = () => {
    return (
      <>
        <SignIn isOpen={false} />
        <SignUp isOpen={false} />
        <UserProductDetails isOpen={false} />
      </>
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
      <Box as="section" h="auto">
        <UserProductDetails
          isOpen={Boolean(product)}
          onClose={() => setProduct(null)}
          product={product}
        />
        {_renderPopup()}
        <Grid templateColumns="repeat(4, 1fr)" gap={5}>
          {_renderProduct()}
        </Grid>
      </Box>
    );
  };

  return <>{_renderProductSection()}</>;
};

export default Home;
