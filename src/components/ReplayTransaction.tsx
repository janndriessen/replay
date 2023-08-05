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
  Text,
} from "@chakra-ui/react";

interface ReplayButtonProps {
  onClick: () => void;
}

export const ReplayButton = ({ onClick }: ReplayButtonProps) => (
  <Button
    bg={"#FF0420"}
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
      <div>OP</div>
    </>
  );
}
