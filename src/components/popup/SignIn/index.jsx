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
} from "@chakra-ui/react";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { setToken, setUserData } from "../../../lib/utils";
import { useToast } from "@chakra-ui/react";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Email chưa đúng định dạng!")
      .required("Email là trường bắt buộc!"),
    password: yup.string().required("Password là trường bắt buộc!"),
  })
  .required();
const SignIn = (payload) => {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    axios
      .post("http://localhost:8080/api/auth/signin", data)
      .then((response) => {
        if (response.status === 200) {
          const { accessToken, user } = response.data.payload;
          setUserData(user);
          setToken(accessToken);
          payload.onClose();
          reset();
        }
      })
      .catch((e) => {
        if (e.response && e.response.status === 404) {
          // The user's account is locked (status is "inactive")
          toast({
            title: "Tài khoản của bạn đã bị admin khoá",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else {
          // For other errors, show the standard error message
          toast({
            title: e.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
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
        <ModalHeader>Đăng nhập tài khoản</ModalHeader>
        <ModalBody pb={6}>
          <FormControl mt={4} isInvalid={Boolean(errors.email?.message)}>
            <FormLabel>E-mail</FormLabel>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="example@email.com"
                  type="email"
                  autoComplete="username"
                  {...field}
                />
              )}
            />
            {errors.email?.message ? (
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            ) : null}
          </FormControl>
          <FormControl mt={4} isInvalid={Boolean(errors.password?.message)}>
            <FormLabel>Mật khẩu</FormLabel>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Mật khẩu"
                  autoComplete="current-password"
                  type="password"
                  {...field}
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
            Đăng nhập
          </Button>
          <Button onClick={payload.onClose}>Hủy</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignIn;
