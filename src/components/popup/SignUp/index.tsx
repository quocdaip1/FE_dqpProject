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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Email chưa đúng định dạng!")
      .required("Email là trường bắt buộc!"),
    password: yup
      .string()
      .min(6, "Mật khẩu có ít nhất 6 ký tự")
      .required("Mật khẩu là trường bắt buộc!"),
    firstName: yup.string().required("Họ và tên đệm là trường bắt buộc!"),
    lastName: yup.string().required("Tên là trường bắt buộc!"),
    phonenumber: yup
      .string()
      .matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
        "Số điện thoại chưa đúng định dạng"
      )
      .required("Số điện thoại là trường bắt buộc!"),
  })
  .required();

const SignUp = ({ isOpen, onClose }) => {
  const toast = useToast();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    const response = await axios.post("http://localhost:8080/api/auth/signup", {
      ...data,
      role: "user",
    });
    const { status, message } = response.data.payload;

    if (status) {
      onClose();
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
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>Đăng ký</ModalHeader>
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
          <FormControl
            mt={4}
            isRequired
            isInvalid={Boolean(errors.email?.message)}
          >
            <FormLabel>E-mail</FormLabel>

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="example@email.com"
                  type="email"
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
            isInvalid={Boolean(errors.password?.message)}
          >
            <FormLabel>Mật khẩu</FormLabel>

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Mật khẩu"
                  type="password"
                  {...field}
                  required={false}
                />
              )}
            />
            {errors.password?.message ? (
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            ) : null}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} type="submit">
            Đăng ký
          </Button>
          <Button onClick={onClose}>Hủy</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignUp;
