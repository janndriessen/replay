import {
  useDisclosure,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slide,
  Box,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Tfoot,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

interface ReplayButtonProps {
  onClick: () => void;
}

export const ReplayButton = ({ onClick }: ReplayButtonProps) => (
  <Button
    bg={"op"}
    borderRadius={"12"}
    color={"#fff"}
    fontSize={"16"}
    fontWeight={"700"}
    px="20"
    py="6"
    onClick={onClick}
  >
    Replay
  </Button>
);

export function ReplayTransaction() {
  return (
    <>
      <InputGroup>
        <InputLeftAddon children="Custom Gas Limit" />
        <Input type="number" placeholder="500_000" />
      </InputGroup>
      <TableContainer mt="4">
        <Table variant="simple">
          <TableCaption>Cost Estimation</TableCaption>
          <Thead>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td isNumeric>25.4</Td>
            </Tr>
            <Tr>
              <Td>feet</Td>
              <Td>centimetres (cm)</Td>
              <Td isNumeric>30.48</Td>
            </Tr>
            <Tr>
              <Td>yards</Td>
              <Td>metres (m)</Td>
              <Td isNumeric>0.91444</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
