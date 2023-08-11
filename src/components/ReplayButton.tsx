import { Button, Spinner, Text } from "@chakra-ui/react";

interface ReplayButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export const ReplayButton = ({ isLoading, onClick }: ReplayButtonProps) => (
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
    {isLoading ? <Spinner color="white" /> : <Text>Replay</Text>}
  </Button>
);
