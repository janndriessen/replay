import { Flex, Box, Text } from "@chakra-ui/react";

export function BigTitle() {
  return (
    <Flex align={"center"} gap={4}>
      <Box borderRadius={48} bg={"op"} w={10} h={10} />
      <Text fontSize="6xl" fontWeight={400} mb="1">
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
