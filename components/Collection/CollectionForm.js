import {
  Box,
  Button,
  CheckIcon,
  HStack,
  Select,
  Text,
  useToast,
  View,
  VStack,
} from "native-base";
import Input from "./Input";
import CollectionFormHeader from "./CollectionFormHeader";
import { GlobalStyles } from "../../constants/styles";
import {
  getBatches,
  getExamList,
  getMajorNames,
  getOccupationMajorTypes,
  getSchoolNames,
  submitCollection,
  submitFee,
} from "../../fetches";
import IconButton from "../UI/IconButton";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Fragment, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../store/auth-context";
import { getId } from "../../util/common";
import Loading from "../UI/Loading";
import {
  EDUCATION_FORM,
  OCCUPATION_FORM,
  TITLE_FORM,
  TRAIN_FORM,
} from "../../constants/collections";
import {
  getInfoByIdNum,
  updateCollection,
  updateCollectionFee,
} from "../../fetches/modules/common";

function CollectionForm({
  defaultValues = {},
  defaultLabels = [],
  collectionType,
  isUpdate = false,
  onSubmit,
}) {
  const authCtx = useContext(AuthContext);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const [inputFields, setInputFields] = useState([...defaultLabels]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "payInfos",
  });

  const labelsWatchFields = defaultLabels.reduce(
    (fields, { field, isChildrenValueForId = false, childrenField = "" }) => {
      if (childrenField) {
        return {
          ...fields,
          [field]: { isChildrenValueForId, childrenField },
        };
      }
      return fields;
    },
    {}
  );

  useEffect(() => {
    const subscription = watch(async (value, { name, type }) => {
      if (name === "idNum") {
        const idNum = value[name];
        const isValid =
          /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
            idNum
          );
        if (!isValid) return;
        try {
          const { student = {} } = await getInfoByIdNum(idNum, authCtx.token);
          const { name, phoneNum, ...appDoNotNeedFields } = student;
          setValue("name", name);
          setValue("phone", phoneNum);
          setValue("appDoNotNeedFields", appDoNotNeedFields);
        } catch (error) {
          console.log(`error`, error);
        }
      }
      if (labelsWatchFields[name] && value[name]) {
        handleChangeChildrenOptions(value[name].id, labelsWatchFields[name]);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, labelsWatchFields]);

  function setCollectionData(data, id) {
    switch (collectionType) {
      case EDUCATION_FORM:
        return {
          studentEducations: [
            {
              studyMode: data.studyType.label,
              batch: data.batch,
              educationName: data.educationLevel.label,
              schoolName: data.schoolName.label,
              majorName: data.courseName,
              flag: 1,
              id,
            },
          ],
        };
      case OCCUPATION_FORM:
        return {
          studentOccupations: [
            {
              professionalTypes: data.professionalTypes.label,
              majorName: data.occupationInfoName,
              batch: data.batch,
              applyExplain: data.applyExplain,
              flag: 1,
              id,
            },
          ],
        };
      case TITLE_FORM:
        return {
          studentTitles: [
            {
              professionalLevel: data.professionalLevel,
              professionalSeries: data.professionalSeries.label,
              majorName: data.occupationInfoName,
              batch: data.batch,
              flag: 1,
              id,
            },
          ],
        };
      case TRAIN_FORM:
        return {
          studentTrains: [
            {
              applyProject: data.applyProject.label,
              examCourse: data.trainInfoName.toString(),
              classs: data.classs,
              batch: data.batch,
              applyAssist: data.applyAssist,
              startDate: data.startDate,
              endDate: data.endDate,
              teacherId: authCtx.userInfo.account.split("-")[1],
              flag: 1,
              id,
            },
          ],
        };
    }
  }

  async function onFormSubmit(data) {
    const userInfo = authCtx.userInfo;
    const genId = getId() + userInfo.mobile.slice(7);
    const teacherId = userInfo.account.split("-")[1];
    const student = {
      pid: teacherId,
      name: data.name,
      idNo: data.idNum,
      phoneNum: data.phone,
      ...data.appDoNotNeedFields,
    };

    isUpdate && (student.id = data.id);

    const collectionData = setCollectionData(
      data,
      isUpdate ? data.studentInfoId : genId
    );

    setIsLoading(true);

    try {
      const requestBody = { ...collectionData, student: [student] };

      const submitAction = isUpdate ? updateCollection : submitCollection;

      const { message, commitBoolean } = await submitAction(
        requestBody,
        authCtx.token
      );

      const fees = data.payInfos.map((item) => {
        const feeData = {
          studentId: isUpdate ? data.id : message,
          teacherId,
          commitFlag: 1,
          businessProgress: 0,
          trainType: collectionType,
          // ????????????
          studyId: isUpdate ? data.studentInfoId : genId,
          // ??????
          stage: item.stage,
          // ????????????
          term: item.payDate,
          // ????????????
          amount: item.cost,
          // ???????????????
          flag: item.isPay,
          // ????????????
          receiptStatus: "0",
          // ????????????
          receiptNo: "",
          // ????????????
          otherName: data.costType,
          // ?????????
          otherFee: data.cost,
          // ?????????
          paidinFee: data.cultivateCost,
          // ??????
          explains: data.remark,
          // ?????????
          allFee: data.allCost,
          // ????????????
          preferentialFee: data.costOffer,
          // ????????????
          realPayFee: data.finishCost,
        };

        if (isUpdate) {
          feeData.id = item.id;
          feeData.commitBoolean = commitBoolean;
        }
        return feeData;
      });

      isUpdate
        ? await updateCollectionFee(fees, authCtx.token)
        : await submitFee(fees, authCtx.token);

      toast.show({
        description: "????????????",
        placement: "top",
      });
      onSubmit();
    } catch (error) {
      setIsLoading(false);
      console.log(`error`, error);
    }
  }

  function updateOptionsById({ childrenField }, data) {
    const updatableIndex = inputFields.findIndex(
      (item) => item.field === childrenField
    );
    const updatableField = inputFields[updatableIndex];
    if (updatableField.type === "MultiSelect") {
      setValue(childrenField, []);
    } else {
      setValue(childrenField, "");
    }
    const updatedItem = { ...updatableField, options: [...data] };
    const updatedFields = [...inputFields];
    updatedFields[updatableIndex] = updatedItem;
    setInputFields(updatedFields);
  }

  async function fetchChildrenOptionsByParentId(
    id,
    { isChildrenValueForId, childrenField }
  ) {
    let data;
    switch (childrenField) {
      case "batch":
        data = await getBatches(id, "education");
        break;
      case "schoolName":
        data = await getSchoolNames(id);
        break;
      case "courseName":
        data = await getMajorNames(id);
        break;
      case "occupationInfoName":
        data = await getOccupationMajorTypes(id);
        break;
      case "trainInfoName":
        data = await getExamList(id);
        break;
      default:
        data = [];
    }

    return data.map((item) => ({
      id: item.id,
      label: item[childrenField],
      value: isChildrenValueForId ? item.id : item[childrenField],
    }));
  }

  async function handleChangeChildrenOptions(parentId, inputIdentifier) {
    let data = await fetchChildrenOptionsByParentId(parentId, inputIdentifier);

    updateOptionsById(inputIdentifier, data);
  }

  function handleAppendPayInfo() {
    if (collectionType === EDUCATION_FORM && fields.length >= 4) {
      toast.show({
        description: "????????????????????????4???",
        placement: "top",
      });
      return;
    }

    if (collectionType !== EDUCATION_FORM && fields.length >= 2) {
      toast.show({
        description: "????????????????????????2???",
        placement: "top",
      });
      return;
    }

    append({
      stage: "",
      cost: "",
      payDate: "",
      isPay: 0,
    });
  }

  if (isLoading) {
    return <Loading loading={isLoading} loadingText="?????????" />;
  }

  return (
    <View>
      <CollectionFormHeader title="????????????" />
      <VStack
        borderRadius={10}
        paddingX="3"
        paddingTop="5"
        paddingBottom="3"
        marginBottom="4"
        // borderTopLeftRadius={0}
        backgroundColor="#f2f2f2"
        justifyContent="space-around"
      >
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="??????"
              invalid={errors.name}
              textInputConfig={{
                isDisabled: isUpdate,
                onChangeText: onChange,
                value,
                placeholder: "???????????????",
              }}
            />
          )}
          name="name"
        />
        {errors.name && (
          <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
            ??????????????????
          </Text>
        )}
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: "?????????????????????",
            },
            pattern: {
              value:
                /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
              message: "???????????????",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="?????????"
              invalid={errors.idNum}
              textInputConfig={{
                isDisabled: isUpdate,
                onChangeText: onChange,
                value,
                placeholder: "??????????????????",
              }}
            />
          )}
          name="idNum"
        />
        {errors.idNum && (
          <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
            {errors.idNum.message}
          </Text>
        )}
        <Controller
          control={control}
          rules={{
            required: { value: true, message: "?????????????????????" },
            pattern: {
              value:
                /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
              message: "??????????????????",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="?????????"
              invalid={errors.phone}
              textInputConfig={{
                keyboardType: "phone-pad",
                onChangeText: onChange,
                maxLength: 11,
                value,
                placeholder: "??????????????????",
              }}
            />
          )}
          name="phone"
        />
        {errors.phone && (
          <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
            {errors.phone.message}
          </Text>
        )}
      </VStack>
      <CollectionFormHeader title="????????????" />
      <VStack
        borderRadius={10}
        paddingX="3"
        paddingTop="5"
        paddingBottom="3"
        marginBottom="4"
        borderTopLeftRadius={0}
        backgroundColor="#f2f2f2"
        justifyContent="space-around"
      >
        {inputFields.map((c) => (
          <Fragment key={c.field}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label={c.name}
                  selectOptions={c.options || []}
                  invalid={errors[c.field]}
                  isObjectValue={!!c.childrenField}
                  textInputConfig={{
                    onChangeText: onChange,
                    value,
                    placeholder: c.placeholder || "",
                    multiline: c.multiline,
                    type: c.type,
                  }}
                />
              )}
              name={c.field}
            />
            {errors[c.field] && (
              <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
                {c.name}????????????
              </Text>
            )}
          </Fragment>
        ))}
      </VStack>
      <CollectionFormHeader title="????????????" />
      {fields.map((item, index) => (
        <VStack
          key={item.id}
          borderRadius={10}
          paddingX="3"
          paddingTop="5"
          paddingBottom="3"
          marginBottom="4"
          borderTopLeftRadius={index === 0 ? 0 : 10}
          backgroundColor="#f2f2f2"
          justifyContent="space-around"
        >
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="????????????"
                invalid={errors.payInfos && errors.payInfos[index].stage}
                textInputConfig={{
                  keyboardType: "decimal-pad",
                  onChangeText: onChange,
                  value,
                  placeholder: "?????????????????????",
                }}
              />
            )}
            name={`payInfos.${index}.stage`}
          />
          {errors.payInfos && errors.payInfos[index].stage && (
            <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
              ????????????????????????
            </Text>
          )}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="????????????"
                invalid={errors.payInfos && errors.payInfos[index].cost}
                textInputConfig={{
                  keyboardType: "decimal-pad",
                  onChangeText: onChange,
                  value,
                  placeholder: "?????????????????????",
                }}
              />
            )}
            name={`payInfos.${index}.cost`}
          />
          {errors.payInfos && errors.payInfos[index].cost && (
            <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
              ????????????????????????
            </Text>
          )}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="????????????"
                invalid={errors.payInfos && errors.payInfos[index].payDate}
                textInputConfig={{
                  onChangeText: onChange,
                  value,
                  type: "Date",
                  placeholder: "?????????????????????",
                }}
              />
            )}
            name={`payInfos.${index}.payDate`}
          />
          {errors.payInfos && errors.payInfos[index].payDate && (
            <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
              ????????????????????????
            </Text>
          )}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="????????????"
                invalid={errors.payInfos && errors.payInfos[index].isPay}
                selectOptions={[
                  {
                    id: 1,
                    label: "???",
                    value: 1,
                  },
                  {
                    id: 0,
                    label: "???",
                    value: 0,
                  },
                ]}
                textInputConfig={{
                  isDisabled: true,
                  keyboardType: "decimal-pad",
                  onChangeText: onChange,
                  value,
                  type: "Select",
                  placeholder: "?????????????????????",
                }}
              />
            )}
            name={`payInfos.${index}.isPay`}
          />
          {errors.payInfos && errors.payInfos[index].isPay && (
            <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
              ????????????????????????
            </Text>
          )}

          <Box
            flex="1"
            borderRadius={10}
            alignSelf="flex-end"
            backgroundColor="#fff"
          >
            {index === 0 ? (
              <IconButton
                icon="ios-add"
                color="#000"
                size={24}
                title="????????????"
                onPress={handleAppendPayInfo}
              />
            ) : (
              <IconButton
                icon="ios-remove"
                color="#000"
                size={24}
                title="??????"
                onPress={() => remove(index)}
              />
            )}
          </Box>
        </VStack>
      ))}
      <VStack
        borderRadius={10}
        paddingX="3"
        paddingTop="5"
        paddingBottom="3"
        marginBottom="4"
        backgroundColor="#f2f2f2"
        justifyContent="space-around"
      >
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="?????????"
              invalid={errors.allCost}
              textInputConfig={{
                keyboardType: "decimal-pad",
                onChangeText: onChange,
                value,
                placeholder: "??????????????????",
              }}
            />
          )}
          name="allCost"
        />
        {errors.allCost && (
          <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
            ?????????????????????
          </Text>
        )}
        <HStack
          marginBottom={2}
          justifyContent="space-between"
          alignItems="stretch"
        >
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                selectedValue={value}
                style={{ paddingTop: 12, paddingBottom: 12 }}
                bgColor="#fff"
                borderWidth={0}
                borderRadius="md"
                textAlign="center"
                fontWeight="bold"
                fontSize={14}
                flex="1"
                w="96%"
                placeholder="?????????"
                _selectedItem={{
                  endIcon: <CheckIcon size="5" />,
                }}
                onValueChange={onChange}
              >
                <Select.Item shadow={2} label="?????????" value="?????????" />
                <Select.Item shadow={2} label="?????????" value="?????????" />
                <Select.Item shadow={2} label="???????????????" value="???????????????" />
                <Select.Item shadow={2} label="???????????????" value="???????????????" />
              </Select>
            )}
            name="costType"
          />

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                label={null}
                // invalid={errors.cost}
                textInputConfig={{
                  keyboardType: "decimal-pad",
                  onChangeText: onChange,
                  value,
                  placeholder: "???????????????",
                }}
              />
            )}
            name="cost"
          />
        </HStack>
        {/* {errors.cost && (
          <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
            ??????????????????
          </Text>
        )} */}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="?????????"
              invalid={errors.cultivateCost}
              textInputConfig={{
                keyboardType: "decimal-pad",
                onChangeText: onChange,
                value,
                placeholder: "??????????????????",
              }}
            />
          )}
          name="cultivateCost"
        />
        {errors.cultivateCost && (
          <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
            ?????????????????????
          </Text>
        )}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="????????????"
              invalid={errors.costOffer}
              textInputConfig={{
                keyboardType: "decimal-pad",
                onChangeText: onChange,
                value,
                placeholder: "?????????????????????",
              }}
            />
          )}
          name="costOffer"
        />
        {errors.costOffer && (
          <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
            ????????????????????????
          </Text>
        )}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="????????????"
              invalid={errors.finishCost}
              textInputConfig={{
                keyboardType: "decimal-pad",
                onChangeText: onChange,
                value,
                placeholder: "?????????????????????",
              }}
            />
          )}
          name="finishCost"
        />
        {errors.finishCost && (
          <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
            ????????????????????????
          </Text>
        )}
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              label="??????"
              // invalid={errors.remark}
              textInputConfig={{
                mt: "2",
                w: "100%",
                multiline: true,
                onChangeText: onChange,
                value,
                placeholder: "???????????????",
              }}
            />
          )}
          name="remark"
        />
        {/* {errors.remark && (
          <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
            ??????????????????
          </Text>
        )} */}
      </VStack>
      {(defaultValues?.denyReason || null) && (
        <>
          <CollectionFormHeader title="????????????" />
          <VStack
            borderRadius={10}
            paddingX="3"
            paddingBottom="3"
            marginBottom="4"
            borderTopLeftRadius={0}
            backgroundColor="#f2f2f2"
            justifyContent="space-around"
          >
            <Controller
              control={control}
              render={({ field: { value } }) => (
                <Input
                  label={null}
                  textInputConfig={{
                    isDisabled: true,
                    mt: "2",
                    w: "100%",
                    multiline: true,
                    value,
                    placeholder: "?????????????????????",
                  }}
                />
              )}
              name="denyReason"
            />
          </VStack>
        </>
      )}
      <HStack marginTop="2">
        <Button
          w="100%"
          borderRadius={10}
          _text={{ fontWeight: "bold" }}
          colorScheme="blue"
          onPress={handleSubmit(onFormSubmit)}
        >
          ??????
        </Button>
      </HStack>
    </View>
  );
}

export default CollectionForm;
