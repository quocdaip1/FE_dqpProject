import { Box, Container, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box as="footer" display="flex" alignItems="center" boxShadow="base">
      <Container maxW="880px">
        <Text fontSize="xs" textAlign="center" padding="12px 0" fontWeight="700">
          © Bản quyền thuộc về Caraluna.vn
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;
