import { Button } from "@chakra-ui/react";

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
