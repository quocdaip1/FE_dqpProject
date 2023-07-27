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
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  // useToast,
  Center,
  Divider,
} from "@chakra-ui/react";
import { Pagination } from "../../components/common";
import { AdminCategoryDetails } from "../../components/popup";
import React from "react";
import { useRef } from "react";
import axios from "axios";
import { HiPencilSquare, HiOutlineTrash } from "react-icons/hi2";
// import { getToken } from "../../lib/utils";

const CategoryList = () => {
  // const toast = useToast();
  const [payload, setPayload] = React.useState([]);
  const [isShowPopup, setIsShowPopup] = React.useState(false);
  const [product, setProduct] = React.useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(null);
  const cancelRef = useRef();

  const [meta, setMeta] = React.useState({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPage: 0,
  });

  const fetchProduct = async (page) => {
    const response = await axios.get("http://localhost:8080/api/categories", {
      params: {
        page,
        limit: 10,
      },
    });
    const { items, meta } = response.data.payload;
    setMeta(meta);
    setPayload(items);
  };

  const handleDeleteAlertOpen = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteAlertClose = () => {
    setSelectedCategoryId(null);
    setIsDeleteAlertOpen(false);
  };

  const deleteCategory = async (id) => {
    await axios.delete(`http://localhost:8080/api/categories/remove/${id}`);
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    fetchProduct(meta.currentPage);
  };

  React.useEffect(() => {
    fetchProduct(1);
  }, []);

  return (
    <Container maxW="6xl" h="100%" padding="15px">
      <AdminCategoryDetails
        isOpen={isShowPopup}
        onClose={() => {
          setIsShowPopup(false);
          setProduct(null);
          fetchProduct(meta.currentPage);
        }}
        product={product}
      />
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleDeleteAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xóa danh mục
            </AlertDialogHeader>
            <AlertDialogBody>
              Bạn có chắc bạn muốn xóa danh mục này? Bạn sẽ không thể hoàn tác
              sau khi thực hiện hành động này.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleDeleteAlertClose}>
                Hủy
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleDelete(selectedCategoryId);
                  handleDeleteAlertClose();
                }}
                ml={3}
              >
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Box boxShadow="xl" h="auto" p="20px" borderRadius={10}>
        <Text fontSize="xl" marginBottom="10px">
          Category
        </Text>
        <Divider></Divider>
        <HStack
          flexWrap="wrap"
          marginBottom="50px"
          justifyContent="space-between"
          spacing={6}
        ></HStack>
        <Button
          colorScheme="facebook"
          marginBottom="16px"
          size="sm"
          onClick={() => setIsShowPopup(true)}
        >
          Tạo
        </Button>
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Tên danh mục</Th>
                <Th>Giá trị danh mục</Th>
                <Th>Parent</Th>
                <Th textAlign="center">Hành động</Th>
              </Tr>
            </Thead>
            <Tbody>
              {payload.length > 0 ? (
                payload.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.id}</Td>
                    <Td>{item.label}</Td>
                    <Td>{item.value}</Td>
                    <Td>{item.parent}</Td>
                    <Td>
                      <Center>
                        <IconButton
                          marginRight="12px"
                          onClick={() => {
                            setProduct(item);
                            setIsShowPopup(true);
                          }}
                        >
                          <HiPencilSquare />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteAlertOpen(item.id)}
                        >
                          <HiOutlineTrash />
                        </IconButton>
                      </Center>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4}>No categories found.</Td>
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

export default CategoryList;
