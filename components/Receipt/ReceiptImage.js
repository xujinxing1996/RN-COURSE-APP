import { Button, HStack, Image } from "native-base";
import IconButton from "../UI/IconButton";

function ReceiptImage({ file, onRemove }) {
  return (
    <HStack alignItems="center">
      <Image
        source={{
          uri: file.uri,
        }}
        alt={file.name}
        size="xl"
      />
      <IconButton
        icon="close-circle"
        size={28}
        color="#000"
        onPress={onRemove}
      />
    </HStack>
  );
}

export default ReceiptImage;
