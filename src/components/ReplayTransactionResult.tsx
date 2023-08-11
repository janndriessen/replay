import { useNetwork } from "wagmi";
import { Button, Flex, Link, Text } from "@chakra-ui/react";

interface ReplayTransactionResultProps {
  hash?: string;
  onClose: () => void;
}

export function ReplayTransactionResult({
  hash,
  onClose,
}: ReplayTransactionResultProps) {
  const { chain } = useNetwork();

  const explorerUrl = chain?.blockExplorers?.default.url ?? "";

  const isSuccess = hash !== undefined && hash.length > 0;
  const text = isSuccess
    ? "Your transaction was successfully replayed."
    : "There was an error replaying your tx.";

  const done = () => {
    onClose();
  };

  return (
    <Flex
      direction={"column"}
      alignItems="center"
      justify={"center"}
      p={"32px"}
    >
      <Text fontSize={"2xl"}>{text}</Text>
      {isSuccess && (
        <Link href={`${explorerUrl}/tx/${hash}`} isExternal mt="16px">
          View on Etherscan
        </Link>
      )}
      <Button onClick={done} mt={"32px"}>
        Done
      </Button>
    </Flex>
  );
}
