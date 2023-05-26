import {
  Box,
  Container,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Input,
  Select,
  Button,
  WrapItem,
  Wrap,
  IconButton,
} from "@chakra-ui/react";
import { Pagination } from "../../components/common";
import React from "react";
import axios from "axios";
import { AdminProductDetails } from "../../components/popup";
import { HiOutlineEye } from "react-icons/hi2";

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

const sizeOptions = [
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
];

const statusOptions = [
  {
    label: "Hoạt động",
    value: "active",
  },
  {
    label: "Không hoạt động",
    value: "inactive",
  },
  {
    label: "Hết hàng",
    value: "outOfStock",
  },
];

const ProductList = () => {
  const [keyword, setKeyword] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [meta, setMeta] = React.useState({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPage: 0,
  });
  const [payload, setPayload] = React.useState([]);
  const [isShowPopup, setIsShowPopup] = React.useState(false);
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

  return (
    <Container maxW="6xl" h="100%" padding="15px">
      <AdminProductDetails
        isOpen={isShowPopup}
        onClose={() => {
          setIsShowPopup(false);
          setProduct(null);
          fetchProduct(meta.currentPage);
        }}
        product={product}
      />
      <Box boxShadow="xl" h="auto" p="20px" borderRadius={10}>
        <Text fontSize="xl" marginBottom="10px">
          Sản phẩm
        </Text>
        <HStack
          flexWrap="wrap"
          marginBottom="20px"
          justifyContent="space-between"
          spacing={6}
        >
          <Wrap>
            <WrapItem>
              <Input
                placeholder="Từ khóa"
                w="180px"
                size="sm"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </WrapItem>
            <WrapItem>
              <Select
                placeholder="Trạng thái"
                w="180px"
                size="sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </Select>
            </WrapItem>
            <WrapItem>
              <Button
                size="sm"
                marginRight="6px"
                colorScheme="facebook"
                onClick={() => fetchProduct(1)}
              >
                Lọc
              </Button>
            </WrapItem>
          </Wrap>
          <Button
            colorScheme="facebook"
            size="sm"
            onClick={() => setIsShowPopup(true)}
          >
            Tạo
          </Button>
        </HStack>

        <TableContainer>
          <Table variant="striped" size="sm">
            <Thead>
              <Tr>
                <Th>Tên SP</Th>
                <Th>S.Lượng</Th>
                <Th>Loại</Th>
                <Th>K.Cỡ</Th>
                <Th>Đ.Giá</Th>
                <Th>T.Thái</Th>
                <Th>H.Động</Th>
              </Tr>
            </Thead>
            <Tbody>
              {payload.length > 0 ? (
                payload.map((item, index) => (
                  <Tr key={`row-${index}`}>
                    <Td>{item.name}</Td>
                    <Td>{item.quantity}</Td>
                    <Td>
                      {
                        categoryOptions.find(
                          (option) => option.value === item.categoryCode
                        )?.label
                      }
                    </Td>
                    <Td>
                      {
                        sizeOptions.find((option) => option.value === item.size)
                          ?.label
                      }
                    </Td>
                    <Td>
                      {item.price.toLocaleString("vi-VI", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Td>
                    <Td>
                      {
                        statusOptions.find(
                          (option) => option.value === item.status
                        )?.label
                      }
                    </Td>

                    <Td>
                      <IconButton
                        onClick={() => {
                          setProduct(item);
                          setIsShowPopup(true);
                        }}
                      >
                        <HiOutlineEye />
                      </IconButton>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={7}>Không có sản phẩm</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
        <Pagination onClick={fetchProduct} meta={meta} />
      </Box>
    </Container>
  );
};

export default ProductList;
