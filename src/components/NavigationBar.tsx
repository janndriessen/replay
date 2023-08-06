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
      py={"16px"}
      boxShadow={"md"}
    >
      <SmallTitle />
      {isConnected && <ConnectButton />}
    </Flex>
  );
}
