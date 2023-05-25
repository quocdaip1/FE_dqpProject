import { HStack, IconButton, Text } from "@chakra-ui/react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

const Pagination = (payload) => {
  if (payload.meta.totalPage === 0) return null;

  return (
    <HStack marginTop="20px" justifyContent="flex-end">
      <IconButton
        size="sm"
        disabled={payload.meta.currentPage === 1}
        onClick={() => {
          if (payload.meta.currentPage > 1)
            payload.onClick(payload.meta.currentPage - 1);
        }}
      >
        <HiOutlineChevronLeft />
      </IconButton>
      <Text fontSize="sm">
        {payload.meta.currentPage}/{payload.meta.totalPage}
      </Text>
      <IconButton
        size="sm"
        disabled={payload.meta.currentPage === payload.meta.totalPage}
        onClick={() => {
          if (payload.meta.currentPage < payload.meta.totalPage)
            payload.onClick(payload.meta.currentPage + 1);
        }}
      >
        <HiOutlineChevronRight />
      </IconButton>
    </HStack>
  );
};

export default Pagination;
