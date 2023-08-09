import { Flex } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { SmallTitle } from "./";

interface NavBarProps {
  isConnected: boolean;
}

export function NavigationBar({ isConnected }: NavBarProps) {
  return (
    <Flex
      alignItems={"center"}
      justify={"space-between"}
      px={"32px"}
      py={"20px"}
      boxShadow={"sm"}
    >
      <SmallTitle />
      {isConnected && <ConnectButton />}
    </Flex>
  );
}
