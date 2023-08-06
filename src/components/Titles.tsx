import { Flex, Box, Text } from "@chakra-ui/react";

export function BigTitle() {
  return (
    <Flex alignItems={"center"} gap={3}>
      <Box borderRadius={48} bg={"op"} w={9} h={9} />
      <Text fontSize="5xl" fontWeight={400}>
        Replay
      </Text>
    </Flex>
  );
}

export function SmallTitle() {
  return (
    <Flex alignItems={"center"} gap={2}>
      <Box borderRadius={48} bg={"op"} w={4} h={4} />
      <Text fontSize="lg" fontWeight={400}>
        Replay
      </Text>
    </Flex>
  );
}
