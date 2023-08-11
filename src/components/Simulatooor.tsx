import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/react";

interface SimulatorProps {
  isSuccess: boolean;
}

export function Simulator({ isSuccess }: SimulatorProps) {
  return (
    <Flex
      bg={isSuccess ? "green.50" : "red.50"}
      borderRadius={"16px"}
      borderColor={isSuccess ? "gray" : "red"}
      borderWidth={1}
      pl={"16px"}
      pr={"32px"}
      py={"16px"}
      mt={"32px"}
      align={"center"}
      justify={"space-between"}
    >
      <Flex direction={"column"}>
        <Text fontWeight={500}>Simulation</Text>
        <Text color={"gray"}>
          {isSuccess
            ? "Simulating the transaction was successful."
            : "Simulating the tx failed. Submit on your own risk."}
        </Text>
      </Flex>
      {isSuccess && <CheckIcon color="green" />}
      {!isSuccess && <CloseIcon color="red" />}
    </Flex>
  );
}
