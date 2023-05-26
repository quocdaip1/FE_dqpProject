import React from "react";

import {
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
  Select,
  Textarea,
} from "@chakra-ui/react";
import { getUserData, setUserData } from "../../../lib/utils";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { getToken } from "../../../lib/utils";
import { useToast } from "@chakra-ui/react";
import City from "../../../lib/city";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Email chưa đúng định dạng!")
      .required("Email là trường bắt buộc!"),
    firstName: yup.string().required("Họ và tên đệm là trường bắt buộc!"),
    lastName: yup.string().required("Tên là trường bắt buộc!"),
    phonenumber: yup
      .string()
      .matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
        "Số điện thoại chưa đúng định dạng"
      )
      .required("Số điện thoại là trường bắt buộc!"),
    city: yup.string().required("Tỉnh/Thành phố là trường bắt buộc!"),
    address: yup.string().required("Địa chỉ là trường bắt buộc!"),
  })
  .required();

const AdminUserDetails = (payload) => {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const userData = getUserData();
  const toast = useToast();
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
    if (!payload.isOpen) reset();
    else if (payload.isOpen && userData) {
      setValue("firstName", userData.firstName);
      setValue("lastName", userData.lastName);
      setValue("email", userData.email);
      setValue("address", userData.address || "");
      setValue("city", userData.city || "");
      setValue("phonenumber", userData.phonenumber || "");
    }
  }, [payload.isOpen]);

  const onSubmit = async (data) => {
    const response = await axios.put(
      `http://localhost:8080/api/users/${userData.id}`,
      {
        ...data,
      },
      {
        headers: {
          "x-access-token": getToken(),
        },
      }
    );
    const { status, message } = response.data;

    if (status) {
      payload.onClose();
      setUserData({
        ...response.data.payload,
        role: userData.role
      });
      reset();
    }
    toast({
      title: message,
      status: status ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };
  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={payload.isOpen}
      onClose={payload.onClose}
    >
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>Thông tin người dùng</ModalHeader>
        <ModalBody pb={6}>
          <FormControl
            isRequired
            isInvalid={Boolean(errors.firstName?.message)}
          >
            <FormLabel>Họ và tên đệm</FormLabel>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  ref={initialRef}
                  placeholder="Họ và tên đệm"
                  type="text"
                  {...field}
                  required={false}
                />
              )}
            />
            {errors.firstName?.message ? (
              <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
            ) : null}
          </FormControl>
          <FormControl
            mt={4}
            isRequired
            isInvalid={Boolean(errors.lastName?.message)}
          >
            <FormLabel>Tên</FormLabel>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  ref={initialRef}
                  placeholder="Tên"
                  type="text"
                  {...field}
                  required={false}
                />
              )}
            />
            {errors.lastName?.message ? (
              <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
            ) : null}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>E-mail</FormLabel>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  ref={initialRef}
                  placeholder="exampe@email.com"
                  type="text"
                  value={field.value}
                  disabled
                  {...field}
                  required={false}
                />
              )}
            />
            {errors.email?.message ? (
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            ) : null}
          </FormControl>
          <FormControl
            mt={4}
            isRequired
            isInvalid={Boolean(errors.phonenumber?.message)}
          >
            <FormLabel>Số điện thoại</FormLabel>

            <Controller
              name="phonenumber"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="0xxxxxxxxx"
                  type="tel"
                  {...field}
                  required={false}
                />
              )}
            />
            {errors.phonenumber?.message ? (
              <FormErrorMessage>{errors.phonenumber?.message}</FormErrorMessage>
            ) : null}
          </FormControl>
          <FormControl
            mt={4}
            isRequired
            isInvalid={Boolean(errors.city?.message)}
          >
            <FormLabel>Tỉnh/Thành phố</FormLabel>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Tỉnh/Thành phố"
                  {...field}
                  required={false}
                >
                  {City.map((item) => (
                    <option value={item.city} key={`option-${item.city}`}>
                      {item.city}{" "}
                    </option>
                  ))}
                </Select>
              )}
            />
            {errors.city?.message ? (
              <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
            ) : null}
          </FormControl>
          <FormControl
            mt={4}
            isRequired
            isInvalid={Boolean(errors.address?.message)}
          >
            <FormLabel>Địa chỉ</FormLabel>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Textarea
                  placeholder="Kiệt , Phường X, ..."
                  type="tel"
                  {...field}
                  required={false}
                />
              )}
            />
            {errors.address?.message ? (
              <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
            ) : null}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} type="submit">
            Cập nhật
          </Button>
          <Button onClick={payload.onClose}>Hủy</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdminUserDetails;
