import { Button, HStack, useToast, View, VStack } from "native-base";
import * as ImagePicker from "expo-image-picker";
import { useContext, useState } from "react";
import ReceiptLabel from "./ReceiptLabel";
import ReceiptImage from "./ReceiptImage";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../../store/auth-context";
import { uploadReceiptFile } from "../../fetches";
import { submitReceipt } from "../../fetches/modules/receipt";
import { fetchNumber } from "../../fetches/configure";

function Receipt({ onSubmit }) {
  const authCtx = useContext(AuthContext);
  const toast = useToast();
  const route = useRoute();
  const { trainType = "", studyId = "", studentId = "" } = route.params;
  const [selectedImages, setSelectedImages] = useState();
  const [isLoading, setIsLoading] = useState(false);

  async function handlePickImage(key) {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return false;
    }
    // No permissions request is necessary for launching the image library
    const { type, uri, cancelled } = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (cancelled) return;

    const fileName = uri.replace(/(.*\/)*([^.]+).*/gi, "$2");
    let uriParts = uri.split(".");
    let fileType = uriParts[uriParts.length - 1];

    // "type": "image/jpeg",
    // "type": "video/mp4",

    const file = {
      uri,
      type: `${type}/${fileType}`,
      name: `${fileName}.${fileType}`,
    };

    setSelectedImages((si = {}) => {
      return {
        ...si,
        [key]: file,
      };
    });
  }

  function handleRemoveImage(key) {
    setSelectedImages((si = {}) => {
      return {
        ...si,
        [key]: null,
      };
    });
  }

  async function handleUpload() {
    const { token, userId } = authCtx.userInfo;
    const formData = new FormData();
    formData.append("trainType", trainType);
    formData.append("studentId", studentId);
    formData.append("studyId", studyId);
    formData.append("userId", userId);
    Object.keys(selectedImages).forEach((key) => {
      formData.append("propertys", key);
      formData.append("files", selectedImages[key]);
    });

    setIsLoading(true);

    await uploadReceiptFile(formData, token);
    const data = {
      studentId,
      studyId,
      userId,
      commitFlag: 2,
    };
    const response = await submitReceipt(data, token);
    if (response.code === fetchNumber.CODE_200) {
      toast.show({
        description: "提交成功",
        placement: "top",
      });
      onSubmit();
    }
  }

  return (
    <View>
      <VStack
        borderRadius={10}
        padding="5"
        backgroundColor="#f2f2f2"
        justifyContent="space-around"
      >
        <HStack marginBottom={2}>
          <ReceiptLabel label="缴费凭证" />
          {selectedImages?.jiaofei ? (
            <ReceiptImage
              file={selectedImages.jiaofei}
              onRemove={handleRemoveImage.bind(null, "jiaofei")}
            />
          ) : (
            <Button onPress={handlePickImage.bind(null, "jiaofei")}>
              选择图片
            </Button>
          )}
        </HStack>
        <HStack marginBottom={2}>
          <ReceiptLabel label="优惠凭证" />
          {selectedImages?.youhui ? (
            <ReceiptImage
              file={selectedImages.youhui}
              onRemove={handleRemoveImage.bind(null, "youhui")}
            />
          ) : (
            <Button onPress={handlePickImage.bind(null, "youhui")}>
              选择图片
            </Button>
          )}
        </HStack>
        <HStack marginBottom={2}>
          <ReceiptLabel label="其他凭证" />
          {selectedImages?.qita ? (
            <ReceiptImage
              file={selectedImages.qita}
              onRemove={handleRemoveImage.bind(null, "qita")}
            />
          ) : (
            <Button onPress={handlePickImage.bind(null, "qita")}>
              选择图片
            </Button>
          )}
        </HStack>
        {selectedImages && (
          <Button isLoading={isLoading} mt="5" onPress={handleUpload}>
            上传
          </Button>
        )}
      </VStack>
    </View>
  );
}

export default Receipt;
