import { Button, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { Profile } from "../popup";
import { clearCookie } from "../../lib/utils";
import { useNavigate } from "react-router";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const onSignOut = () => {
    clearCookie();
    navigate("/");
  };

  return (
    <HStack boxShadow="base" h="100%" p="20px" justifyContent="space-between">
      <Profile isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <Text>Trang quản lý</Text>
      <HStack>
        <Button
          size="sm"
          colorScheme="facebook"
          onClick={() => setIsOpen(true)}
        >
          Hồ sơ
        </Button>
        <Button size="sm" colorScheme="blackAlpha" onClick={onSignOut}>
          Đăng xuất
        </Button>
      </HStack>
    </HStack>
  );
};

export default Sidebar;
