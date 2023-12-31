import React from "react";

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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Textarea,
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
    name: yup.string().required("Tên sản phẩm là trường bắt buộc!"),
    categoryCode: yup.string().required("Loại là trường bắt buộc!"),
    size: yup.string().required("Kích cỡ là trường bắt buộc!"),
    style: yup.string().required("Phong cách là trường bắt buộc!"),
    quantity: yup
      .number()
      .typeError("Số lượng chưa đúng định dạng số")
      .required("Số lượng là trường bắt buộc!"),
    price: yup
      .number()
      .typeError("Số lượng chưa đúng định dạng số")
      .required("Giá là trường bắt buộc!"),
    material: yup.string().required("Chất liệu là trường bắt buộc!"),
    image: yup.string().required("Hình ảnh là trường bắt buộc!"),
  })
  .required();

const extraSubCategory = {
  DC: {
    label: "Kiểu dáng",
    value: "style",
    child: [
      {
        label: "Choker",
        value: "DC01",
      },
      {
        label: "Chain Necklace",
        value: "DC02",
      },

      {
        label: "Pendant Necklace",
        value: "DC03",
      },
      {
        label: "Statement Necklace",
        value: "DC04",
      },
      {
        label: "Chain Layering",
        value: "DC05",
      },
    ],
  },
  VT: {
    label: "Kiểu dáng",
    value: "style",
    child: [
      {
        label: "Bangle",
        value: "VT01",
      },
      {
        label: "Chain Bracelet",
        value: "VT02",
      },

      {
        label: "Charm Bracelet",
        value: "VT03",
      },
      {
        label: "Bar Bracelet",
        value: "VT04",
      },
      {
        label: "Bracelet Stacking",
        value: "VT05",
      },
    ],
  },
  NH: {
    label: "Kiểu dáng",
    value: "style",
    child: [
      {
        label: "Statement Ring",
        value: "NH01",
      },
      {
        label: "Band Ring",
        value: "NH02",
      },

      {
        label: "Chain Ring",
        value: "NH03",
      },
      {
        label: "Dainty Ring",
        value: "NH04",
      },
      {
        label: "Ring Stacking",
        value: "NH05",
      },
      {
        label: "Signet Ring",
        value: "NH06",
      },
      {
        label: "Braided Ring",
        value: "NH07",
      },
    ],
  },
  HT: {
    label: "Kiểu dáng",
    value: "style",
    child: [
      {
        label: "Studs",
        value: "HT01",
      },
      {
        label: "Huggies",
        value: "HT02",
      },

      {
        label: "Hoops",
        value: "HT03",
      },
      {
        label: "Drops",
        value: "HT04",
      },
      {
        label: "Dangles",
        value: "HT05",
      },
      {
        label: "Jacket Earrings",
        value: "HT06",
      },
      {
        label: "Ear Cuffs",
        value: "HT07",
      },

      {
        label: "Statement Earrings",
        value: "HT08",
      },
      {
        label: "Ear Stacking",
        value: "HT09",
      },
      {
        label: "Climber Earings",
        value: "HT10",
      },
      {
        label: "Cuff Earings",
        value: "HT11",
      },
    ],
  },
};

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
            Xóa sản phẩm
          </AlertDialogHeader>

          <AlertDialogBody>
            Bạn có chắc bạn muốn xóa sản phẩm này? Bạn sẽ không thể hoàn tác sau
            khi thực hiện hành động
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

const AdminProductDetails = (payload) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const watchCategory = watch("categoryCode");

  React.useEffect(() => {
    if (!payload.isOpen) {
      reset({
        name: '',
        categoryCode: '',
        subCategoryCode: '',
        status: '',
        size: '',
        quantity: '',
        style: '',
        price: '',
        material: '',
        description: '',
        event: '',
        image: '',
      });
    } else if (payload.isOpen && payload.product) {
      setValue("name", payload.product.name);
      setValue("categoryCode", payload.product.categoryCode);
      setValue("subCategoryCode", payload.product.subCategoryCode);
      setValue("status", payload.product.status);
      setValue("size", payload.product.size);
      setValue("style", payload.product.style);
      setValue("quantity", payload.product.quantity);
      setValue("price", payload.product.price);
      setValue("material", payload.product.material);
      setValue("description", payload.product.description);
      setValue("image", payload.product.image);
      setValue("event", payload.product.event);
    }
  }, [payload.isOpen, reset, payload.product, setValue]);

  const createProduct = async (data) => {
    const response = await axios.post(
      "http://localhost:8080/api/products",
      data,
      {
        headers: {
          "x-access-token": getToken(),
        },
      }
    );
    return response;
  };

  const updateProduct = async (data) => {
    const response = await axios.put(
      `http://localhost:8080/api/products/${payload.product.code}`,
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
    let response;
    if (payload.product) response = await updateProduct({ ...data });
    else
      response = await createProduct({ ...data }).catch((e) =>
        toast({
          title: e.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      );

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
      const response = await axios.put(
        `http://localhost:8080/api/products/remove/${payload.product.code}`,
        {},
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

  const eventOptions = React.useMemo(() => {
    const resolveElement = [];
    const categoryCode = getValues("categoryCode");

    if (categoryCode) {
      const extraSub = extraSubCategory[categoryCode];
      if (extraSub)
        extraSub.child.forEach((item) =>
          resolveElement.push(<option value={item.value}>{item.label}</option>)
        );
    }
    return <>{resolveElement}</>;
  }, [watchCategory]);

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
          <ModalHeader>Thông tin sản phẩm</ModalHeader>
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={Boolean(errors.name?.message)}>
              <FormLabel>Tên sản phẩm</FormLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Tên sản phẩm"
                    {...field}
                    required={false}
                  />
                )}
              />
              {errors.name?.message ? (
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              ) : null}
            </FormControl>
            <FormControl
              isRequired
              isInvalid={Boolean(errors.categoryCode?.message)}
              mt={4}
            >
              <FormLabel>Trạng thái</FormLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select placeholder="Trạng thái" {...field} required={false}>
                    <option value="active">Hoạt động </option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="outOfStock">Hết hàng</option>
                  </Select>
                )}
              />
              {errors.categoryCode?.message ? (
                <FormErrorMessage>
                  {errors.categoryCode?.message}
                </FormErrorMessage>
              ) : null}
            </FormControl>
            <Stack direction="row" mt={4}>
              <FormControl
                isRequired
                isInvalid={Boolean(errors.categoryCode?.message)}
              >
                <FormLabel>Loại</FormLabel>
                <Controller
                  name="categoryCode"
                  control={control}
                  render={({ field }) => (
                    <Select placeholder="Loại" {...field} required={false}>
                      <option value="DC">Dây chuyền (DC) </option>
                      <option value="VT">Vòng tay (VT)</option>
                      <option value="NH">Nhẫn (NH)</option>
                      <option value="HT">Hoa tai (HT)</option>
                    </Select>
                  )}
                />
                {errors.categoryCode?.message ? (
                  <FormErrorMessage>
                    {errors.categoryCode?.message}
                  </FormErrorMessage>
                ) : null}
              </FormControl>
              <FormControl
                isRequired
                isInvalid={Boolean(errors.subCategoryCode?.message)}
              >
                <FormLabel>Kiểu dáng</FormLabel>
                <Controller
                  name="subCategoryCode"
                  control={control}
                  render={({ field }) => (
                    <Select
                      placeholder="Kiểu dáng"
                      {...field}
                      required={false}
                      isDisabled={!getValues("categoryCode")}
                    >
                      {eventOptions}
                    </Select>
                  )}
                />
                {errors.subCategoryCode?.message ? (
                  <FormErrorMessage>
                    {errors.subCategoryCode?.message}
                  </FormErrorMessage>
                ) : null}
              </FormControl>
            </Stack>
            <Stack direction="row" mt={4}>
              <FormControl isRequired isInvalid={Boolean(errors.size?.message)}>
                <FormLabel>Kích cỡ</FormLabel>
                <Controller
                  name="size"
                  control={control}
                  render={({ field }) => (
                    <Select placeholder="Kích cỡ" {...field} required={false}>
                      <option value="small">Nhỏ</option>
                      <option value="medium">Trung</option>
                      <option value="big">Lớn</option>
                    </Select>
                  )}
                />
                {errors.size?.message ? (
                  <FormErrorMessage>{errors.size?.message}</FormErrorMessage>
                ) : null}
              </FormControl>
              <FormControl
                isRequired
                isInvalid={Boolean(errors.style?.message)}
              >
                <FormLabel>Phong cách</FormLabel>

                <Controller
                  name="style"
                  control={control}
                  render={({ field }) => (
                    <Select
                      placeholder="Phong cách"
                      {...field}
                      required={false}
                    >
                      <option value="sweetKorean">Sweet Korean</option>
                      <option value="coolMinimalist">Cool Minimalist</option>
                      <option value="preppyLady">Preppy Lady</option>
                      <option value="modernClassic">Modern Classic</option>
                      <option value="gifts">Gifts</option>
                    </Select>
                  )}
                />
                {errors.style?.message ? (
                  <FormErrorMessage>{errors.style?.message}</FormErrorMessage>
                ) : null}
              </FormControl>
            </Stack>
            <FormControl
              isRequired
              isInvalid={Boolean(errors.material?.message)}
              mt={4}
            >
              <FormLabel>Chất liệu chính</FormLabel>
              <Controller
                name="material"
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Chất liệu chính"
                    {...field}
                    required={false}
                  >
                    <option value="bacY925">Bạc Ý 925</option>
                    <option value="ngocTrai">Ngọc Trai</option>
                    <option value="daCS">Đá CZ</option>
                  </Select>
                )}
              />
              {errors.material?.message ? (
                <FormErrorMessage>{errors.material?.message}</FormErrorMessage>
              ) : null}
            </FormControl>
            <FormControl
              mt={4}
              isRequired
              isInvalid={Boolean(errors.image?.message)}
            >
              <FormLabel>Hình ảnh</FormLabel>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Hình hảnh" {...field} required={false} />
                )}
              />
              {errors.image?.message ? (
                <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
              ) : null}
            </FormControl>
            <Stack direction="row" mt={4}>
              <FormControl
                isRequired
                isInvalid={Boolean(errors.price?.message)}
              >
                <FormLabel>Giá</FormLabel>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      keepWithinRange={false}
                      clampValueOnBlur={false}
                      {...field}
                      required={false}
                      placeholder="230000"
                    >
                      <NumberInputField />
                    </NumberInput>
                  )}
                />
                {errors.price?.message ? (
                  <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
                ) : null}
              </FormControl>
              <FormControl
                isRequired
                isInvalid={Boolean(errors.quantity?.message)}
              >
                <FormLabel>Số lượng</FormLabel>
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      keepWithinRange={false}
                      clampValueOnBlur={false}
                      {...field}
                      required={false}
                      placeholder="100"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                />
                {errors.quantity?.message ? (
                  <FormErrorMessage>
                    {errors.quantity?.message}
                  </FormErrorMessage>
                ) : null}
              </FormControl>
            </Stack>
            <FormControl isInvalid={Boolean(errors.event?.message)} mt={4}>
              <FormLabel>Dịp sử dụng</FormLabel>
              <Controller
                name="event"
                control={control}
                render={({ field }) => (
                  <Select placeholder="Dịp sử dụng" {...field} required={false}>
                    <option value="Every day">Every day</option>
                    <option value="Date night">Date night</option>
                    <option value="Event">Event</option>
                    <option value="Resort">Resort</option>
                    <option value="gifts">Gifts</option>
                  </Select>
                )}
              />
              {errors.event?.message ? (
                <FormErrorMessage>{errors.event?.message}</FormErrorMessage>
              ) : null}
            </FormControl>
            <FormControl
              mt={4}
              isInvalid={Boolean(errors.description?.message)}
            >
              <FormLabel>Mô tả</FormLabel>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    placeholder="Mô tả"
                    rows={6}
                    resize="none"
                    {...field}
                    required={false}
                  />
                )}
              />
              {errors.description?.message ? (
                <FormErrorMessage>
                  {errors.description?.message}
                </FormErrorMessage>
              ) : null}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {payload.product ? (
              <Button colorScheme="red" mr={3} onClick={() => onOpen()}>
                Xóa sản phẩm
              </Button>
            ) : null}
            <Button colorScheme="blue" mr={3} type="submit">
              {payload.product ? "Cập nhật" : "Thêm"}
            </Button>
            <Button onClick={payload.onClose}>Hủy</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AdminProductDetails;
