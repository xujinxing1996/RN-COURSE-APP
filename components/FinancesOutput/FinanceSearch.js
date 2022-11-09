import { Button, HStack, Input, Text } from "native-base";
import { useState } from "react";

function FinanceSearch({ onSearch }) {
  const [name, setName] = useState("");

  const handlePress = () => {
    onSearch(name);
  };

  return (
    <HStack justifyContent="space-between" mb="2" alignItems="center">
      <Text>学生姓名:</Text>
      <Input
        value={name}
        onChangeText={(text) => setName(text)}
        w="55%"
        h="8"
      />
      <Button w="20%" colorScheme="blue" h="8" size="sm" onPress={handlePress}>
        查询
      </Button>
    </HStack>
  );
}

export default FinanceSearch;
