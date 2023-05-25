import { Box, Button, Icon, Text } from "@chakra-ui/react";
import {
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineClipboardDocumentList,
  HiOutlineArchiveBox,
} from "react-icons/hi2";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <Box w="100%" h="100%" padding="10px" boxShadow="2xl">
      <Link to="/quan-ly/bang-dieu-khien">
        <Button
          display="flex"
          flexDirection="column"
          variant="ghost"
          w="100%"
          mb="10px"
          py={8}
          isActive={pathname === "/quan-ly/bang-dieu-khien"}
        >
          <Icon as={HiOutlineChartBar} />
          <Text fontSize="xs" mt="6px">
            Bảng điều khiển
          </Text>
        </Button>
      </Link>

      <Link to="/quan-ly/san-pham">
        <Button
          display="flex"
          flexDirection="column"
          variant="ghost"
          w="100%"
          mb="10px"
          py={8}
          isActive={pathname === "/quan-ly/san-pham"}
        >
          <Icon as={HiOutlineArchiveBox} />
          <Text fontSize="xs" mt="6px">
            Sản phẩm
          </Text>
        </Button>
      </Link>
      <Link to="/quan-ly/don-hang">
        <Button
          display="flex"
          flexDirection="column"
          variant="ghost"
          w="100%"
          mb="10px"
          py={8}
          isActive={pathname === "/quan-ly/don-hang"}
        >
          <Icon as={HiOutlineClipboardDocumentList} />
          <Text fontSize="xs" mt="6px">
            Đơn hàng
          </Text>
        </Button>
      </Link>
      <Link to="/quan-ly/nguoi-dung">
        <Button
          display="flex"
          flexDirection="column"
          variant="ghost"
          w="100%"
          mb="10px"
          py={8}
          isActive={pathname === "/quan-ly/nguoi-dung"}
        >
          <Icon as={HiOutlineUserGroup} />
          <Text fontSize="xs" mt="6px">
            Người dùng
          </Text>
        </Button>
      </Link>
    </Box>
  );
};

export default Navbar;
