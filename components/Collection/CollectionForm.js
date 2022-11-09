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
          // 报考专业
          studyId: isUpdate ? data.studentInfoId : genId,
          // 期数
          stage: item.stage,
          // 缴费日期
          term: item.payDate,
          // 缴费金额
          amount: item.cost,
          // 是否已缴费
          flag: item.isPay,
          // 收据状态
          receiptStatus: "0",
          // 收据编号
          receiptNo: "",
          // 费用类别
          otherName: data.costType,
          // 报名费
          otherFee: data.cost,
          // 培训费
          paidinFee: data.cultivateCost,
          // 说明
          explains: data.remark,
          // 总费用
          allFee: data.allCost,
          // 优惠费用
          preferentialFee: data.costOffer,
          // 实缴费用
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
        description: "提交成功",
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
        description: "缴费信息最多添加4条",
        placement: "top",
      });
      return;
    }

    if (collectionType !== EDUCATION_FORM && fields.length >= 2) {
      toast.show({
        description: "缴费信息最多添加2条",
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
    return <Loading loading={isLoading} loadingText="提交中" />;
  }

  return (
    <View>
      <CollectionFormHeader title="基本信息" />
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
              label="姓名"
              invalid={errors.name}
              textInputConfig={{
                isDisabled: isUpdate,
                onChangeText: onChange,
                value,
                placeholder: "请输入姓名",
              }}
            />
          )}
          name="name"
        />
        {errors.name && (
          <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
            姓名不能为空
          </Text>
        )}
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: "证件号不能为空",
            },
            pattern: {
              value:
                /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
              message: "无效证件号",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="证件号"
              invalid={errors.idNum}
              textInputConfig={{
                isDisabled: isUpdate,
                onChangeText: onChange,
                value,
                placeholder: "请输入证件号",
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
            required: { value: true, message: "手机号不能为空" },
            pattern: {
              value:
                /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
              message: "无效的手机号",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="手机号"
              invalid={errors.phone}
              textInputConfig={{
                keyboardType: "phone-pad",
                onChangeText: onChange,
                maxLength: 11,
                value,
                placeholder: "请输入手机号",
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
      <CollectionFormHeader title="报考信息" />
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
                {c.name}不能为空
              </Text>
            )}
          </Fragment>
        ))}
      </VStack>
      <CollectionFormHeader title="缴费信息" />
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
                label="缴费期数"
                invalid={errors.payInfos && errors.payInfos[index].stage}
                textInputConfig={{
                  keyboardType: "decimal-pad",
                  onChangeText: onChange,
                  value,
                  placeholder: "请输入缴费期数",
                }}
              />
            )}
            name={`payInfos.${index}.stage`}
          />
          {errors.payInfos && errors.payInfos[index].stage && (
            <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
              缴费期数不能为空
            </Text>
          )}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="缴费金额"
                invalid={errors.payInfos && errors.payInfos[index].cost}
                textInputConfig={{
                  keyboardType: "decimal-pad",
                  onChangeText: onChange,
                  value,
                  placeholder: "请输入缴费金额",
                }}
              />
            )}
            name={`payInfos.${index}.cost`}
          />
          {errors.payInfos && errors.payInfos[index].cost && (
            <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
              缴费金额不能为空
            </Text>
          )}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="缴费日期"
                invalid={errors.payInfos && errors.payInfos[index].payDate}
                textInputConfig={{
                  onChangeText: onChange,
                  value,
                  type: "Date",
                  placeholder: "请选择缴费日期",
                }}
              />
            )}
            name={`payInfos.${index}.payDate`}
          />
          {errors.payInfos && errors.payInfos[index].payDate && (
            <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
              缴费日期不能为空
            </Text>
          )}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="是否缴费"
                invalid={errors.payInfos && errors.payInfos[index].isPay}
                selectOptions={[
                  {
                    id: 1,
                    label: "是",
                    value: 1,
                  },
                  {
                    id: 0,
                    label: "否",
                    value: 0,
                  },
                ]}
                textInputConfig={{
                  isDisabled: true,
                  keyboardType: "decimal-pad",
                  onChangeText: onChange,
                  value,
                  type: "Select",
                  placeholder: "请选择是否缴费",
                }}
              />
            )}
            name={`payInfos.${index}.isPay`}
          />
          {errors.payInfos && errors.payInfos[index].isPay && (
            <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
              是否缴费不能为空
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
                title="增加分期"
                onPress={handleAppendPayInfo}
              />
            ) : (
              <IconButton
                icon="ios-remove"
                color="#000"
                size={24}
                title="删除"
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
              label="总费用"
              invalid={errors.allCost}
              textInputConfig={{
                keyboardType: "decimal-pad",
                onChangeText: onChange,
                value,
                placeholder: "请输入总费用",
              }}
            />
          )}
          name="allCost"
        />
        {errors.allCost && (
          <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
            总费用不能为空
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
                placeholder="请选择"
                _selectedItem={{
                  endIcon: <CheckIcon size="5" />,
                }}
                onValueChange={onChange}
              >
                <Select.Item shadow={2} label="报名费" value="报名费" />
                <Select.Item shadow={2} label="补考费" value="补考费" />
                <Select.Item shadow={2} label="信息采集费" value="信息采集费" />
                <Select.Item shadow={2} label="学历处理费" value="学历处理费" />
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
                  placeholder: "请输入金额",
                }}
              />
            )}
            name="cost"
          />
        </HStack>
        {/* {errors.cost && (
          <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
            金额不能为空
          </Text>
        )} */}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="培训费"
              invalid={errors.cultivateCost}
              textInputConfig={{
                keyboardType: "decimal-pad",
                onChangeText: onChange,
                value,
                placeholder: "请输入培训费",
              }}
            />
          )}
          name="cultivateCost"
        />
        {errors.cultivateCost && (
          <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
            培训费不能为空
          </Text>
        )}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="优惠费用"
              invalid={errors.costOffer}
              textInputConfig={{
                keyboardType: "decimal-pad",
                onChangeText: onChange,
                value,
                placeholder: "请输入优惠费用",
              }}
            />
          )}
          name="costOffer"
        />
        {errors.costOffer && (
          <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
            优惠费用不能为空
          </Text>
        )}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="实缴费用"
              invalid={errors.finishCost}
              textInputConfig={{
                keyboardType: "decimal-pad",
                onChangeText: onChange,
                value,
                placeholder: "请输入实缴费用",
              }}
            />
          )}
          name="finishCost"
        />
        {errors.finishCost && (
          <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
            实缴费用不能为空
          </Text>
        )}
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              label="备注"
              // invalid={errors.remark}
              textInputConfig={{
                mt: "2",
                w: "100%",
                multiline: true,
                onChangeText: onChange,
                value,
                placeholder: "请输入备注",
              }}
            />
          )}
          name="remark"
        />
        {/* {errors.remark && (
          <Text mb="2" ml="2" color={GlobalStyles.colors.error500}>
            备注不能为空
          </Text>
        )} */}
      </VStack>
      {(defaultValues?.denyReason || null) && (
        <>
          <CollectionFormHeader title="审核意见" />
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
                    placeholder: "请输入审核意见",
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
          提交
        </Button>
      </HStack>
    </View>
  );
}

export default CollectionForm;
