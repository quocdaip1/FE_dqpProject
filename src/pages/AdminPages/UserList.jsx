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
  useToast,
  Center,
} from "@chakra-ui/react";
import { Pagination } from "../../components/common";
import { AdminUserDetails } from "../../components/popup";
import React from "react";
import axios from "axios";
import { HiOutlineEye } from "react-icons/hi2";
import { getToken } from "../../lib/utils";

const UserList = () => {
  const toast = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [keyword, setKeyword] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [meta, setMeta] = React.useState({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPage: 0,
  });
  const [payload, setPayload] = React.useState([]);
  const [user, setUser] = React.useState(null);

  const fetchProduct = async (page) => {
    const response = await axios.get("http://localhost:8080/api/users", {
      params: {
        keyword,
        status,
        page,
        limit: 10,
      },
      headers: {
        "x-access-token": getToken(),
      },
    });
    const { items, meta } = response.data.payload;
    setMeta(meta);
    setPayload(items);
  };

  const updateStatus = async (id, status) => {
    const response = await axios.put(
      `http://localhost:8080/api/users/${id}`,
      {
        status,
      },
      {
        headers: {
          "x-access-token": getToken(),
        },
      }
    );

    const { message } = response.data;
    if (response.data.status) {
      fetchProduct(meta.currentPage);
    }
    toast({
      title: message,
      status: status ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  React.useEffect(() => {
    fetchProduct(1);
  }, []);

  return (
    <Container maxW="6xl" h="100%" padding="15px">
      <AdminUserDetails
        isOpen={isOpen}
        onClose={() => {
          setUser(null);
          setIsOpen(false);
        }}
        user={user}
      />
      <Box boxShadow="xl" h="auto" p="20px" borderRadius={10}>
        <Text fontSize="xl" marginBottom="10px">
          Người dùng
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
                value={keyword}
                size="sm"
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
            onClick={() => setIsOpen(true)}
          >
            Tạo
          </Button>
        </HStack>

        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Họ và tên</Th>
                <Th>Email</Th>
                <Th>Số ĐT</Th>
                <Th>Trạng thái</Th>
                <Th textAlign="left">Hành động</Th>
              </Tr>
            </Thead>
            <Tbody>
              {payload.length > 0 ? (
                payload.map((item, index) => (
                  <Tr key={`row-${index}`}>
                    <Td fontWeight={500}>
                      {item.firstName || item.lastName
                        ? `${item.firstName} ${item.lastName}`
                        : "Chưa cập nhật"}
                    </Td>
                    <Td fontWeight={500}>{item.email}</Td>
                    <Td fontWeight={500}>
                      {item.phonenumber || "Chưa xác định"}
                    </Td>
                    <Td fontWeight={500}>
                      <Select
                        placeholder="Trạng thái"
                        w="180px"
                        size="sm"
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                      >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                      </Select>
                    </Td>
                    <Td>
                      <Center>
                        <IconButton
                          onClick={() => {
                            setUser(item);
                            setIsOpen(true);
                          }}
                        >
                          <HiOutlineEye />
                        </IconButton>
                      </Center>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={7}>Không có dữ liệu người dùng</Td>
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

export default UserList;
