import React, { useState, useEffect } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  // NumberDecrementStepper,
  // NumberIncrementStepper,
  // NumberInput,
  // NumberInputField,
  // NumberInputStepper,
  Select,
  // Stack,
  // Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { getToken } from "../../../lib/utils";
import { useToast } from "@chakra-ui/react";

const schema = yup
  .object({
    label: yup.string().required("Tên danh mục là trường bắt buộc!"),
    value: yup.string().required("Giá trị danh mục là trường bắt buộc!"),
    // Các trường khác của danh mục
  })
  .required();

const Alert = (payload) => {
  const cancelRef = React.useRef();
  return (
    <AlertDialog
      isOpen={payload.isOpen}
      leastDestructiveRef={payload.cancelRef}
      onClose={payload.onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Xóa danh mục
          </AlertDialogHeader>

          <AlertDialogBody>
            Bạn có chắc bạn muốn xóa danh mục này? Bạn sẽ không thể hoàn tác sau
            khi thực hiện hành động này.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => payload.onClose(false)}>
              Hủy
            </Button>
            <Button
              colorScheme="red"
              onClick={() => payload.onClose(true)}
              ml={3}
            >
              Xóa
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

const AdminCategoryDetails = (payload) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isEditMode, setIsEditMode] = useState(false); // Thêm trạng thái chỉnh sửa
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  React.useEffect(() => {
    if (!payload.isOpen) {
      reset({
        label: "",
        value: "",
        parent: null,
        // Các trường khác của danh mục
      });
      setIsEditMode(false); // Đặt trạng thái chỉnh sửa thành false khi đóng popup
    } else if (payload.isOpen && payload.product) {
      setValue("label", payload.product.label);
      setValue("value", payload.product.value);
      setValue("parent", payload.product.parent);
      setIsEditMode(true); // Đặt trạng thái chỉnh sửa thành true khi có dữ liệu danh mục
      // Set các trường khác của danh mục
    }
  }, [payload.isOpen, reset, payload.product, setValue]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/categories/parent"
        );
        const { items } = response.data.payload;
        setCategories(items);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  const createCategory = async (data) => {
    const response = await axios.post(
      "http://localhost:8080/api/categories",
      data,
      {
        headers: {
          "x-access-token": getToken(),
        },
      }
    );
    return response;
  };

  const updateCategory = async (data) => {
    const response = await axios.put(
      `http://localhost:8080/api/categories/${payload.product.id}`,
      data,
      {
        headers: {
          "x-access-token": getToken(),
        },
      }
    );
    return response;
  };

  const onSubmit = async (data) => {
    // Convert NaN to null
    if (isNaN(data.parent)) {
      data.parent = ""; // Set it back to an empty string if needed
    }

    let response;
    if (isEditMode) {
      response = await updateCategory({ ...data, id: payload.product.id });
    } else {
      response = await createCategory({ ...data }).catch((e) =>
        toast({
          title: e.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      );
    }

    const { status, message } = response.data;

    if (status) payload.onClose();
    toast({
      title: message,
      status: status ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCloseAlert = async (status) => {
    if (status) {
      const response = await axios.delete(
        `http://localhost:8080/api/categories/remove/${payload.category.id}`,
        {
          headers: {
            "x-access-token": getToken(),
          },
        }
      );
      const { status, message } = response.data;

      if (status) {
        payload.onClose();
      }
      toast({
        title: message,
        status: status ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={payload.isOpen}
        onClose={payload.onClose}
        scrollBehavior="inside"
        size="2xl"
      >
        <Alert onClose={handleCloseAlert} isOpen={isOpen} />
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Thông tin danh mục</ModalHeader>
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={Boolean(errors.label?.message)}>
              <FormLabel>Tên danh mục</FormLabel>
              <Controller
                name="label"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Tên danh mục"
                    {...field}
                    required={false}
                  />
                )}
              />
              {errors.label?.message ? (
                <FormErrorMessage>{errors.label?.message}</FormErrorMessage>
              ) : null}
            </FormControl>
            <FormControl isRequired isInvalid={Boolean(errors.value?.message)}>
              <FormLabel>Giá trị danh mục</FormLabel>
              <Controller
                name="value"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Giá trị danh mục"
                    {...field}
                    required={false}
                  />
                )}
              />
              {errors.value?.message ? (
                <FormErrorMessage>{errors.value?.message}</FormErrorMessage>
              ) : null}
            </FormControl>
            <FormControl isInvalid={Boolean(errors.parent?.message)}>
              <FormLabel>Danh mục cha</FormLabel>
              <Controller
                name="parent"
                control={control}
                render={({ field }) => (
                  <Select placeholder="Chọn danh mục cha" {...field}>
                    <option value={null}>NULL</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </Select>
                )}
              />
              {errors.parent?.message && (
                <FormErrorMessage>{errors.parent?.message}</FormErrorMessage>
              )}
            </FormControl>

            {/* Các trường khác của danh mục */}
          </ModalBody>

          <ModalFooter>
            {isEditMode ? ( // Hiển thị nút cập nhật chỉ khi ở chế độ chỉnh sửa
              <Button colorScheme="blue" mr={3} type="submit">
                Cập nhật
              </Button>
            ) : (
              <Button colorScheme="blue" mr={3} type="submit">
                Thêm
              </Button>
            )}
            {payload.category ? (
              <Button colorScheme="red" mr={3} onClick={() => onOpen()}>
                Xóa danh mục
              </Button>
            ) : null}
            <Button onClick={payload.onClose}>Hủy</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AdminCategoryDetails;
