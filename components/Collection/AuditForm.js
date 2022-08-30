import {
  Button,
  CheckIcon,
  HStack,
  Image,
  Select,
  useToast,
  View,
  VStack,
} from "native-base";
import Input from "./Input";
import CollectionFormHeader from "./CollectionFormHeader";
import { Fragment, useContext, useState } from "react";
import { AuthContext } from "../../store/auth-context";
import Loading from "../UI/Loading";
import FormLabel from "./FormLabel";
import { imageBaseUrl } from "../../fetches/configure";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import ImageView from "react-native-image-viewing";
import { useRoute } from "@react-navigation/native";
import { resolveFinance, resolveTeacher, updateFee } from "../../fetches";
import { Pressable } from "react-native";

function AuditForm({
  defaultValues = { student: {}, fees: [], studentCards: [] },
  otherValues = [],
  isLook,
  businessProgress,
  onSubmit,
}) {
  const route = useRoute();
  const { resolveType = "" } = route.params;
  const authCtx = useContext(AuthContext);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setIsVisible] = useState(false);
  const [imageViewIndex, setImageViewIndex] = useState(0);

  const images = defaultValues.studentCards.map((img) => ({
    uri: imageBaseUrl + img.fileResource,
  }));

  let feeInfoData = null;

  const payInfos = defaultValues.fees.map((fee) => {
    if (!feeInfoData) {
      feeInfoData = {
        // 费用类别
        otherName: fee.otherName,
        // 报名费
        otherFee: fee.otherFee,
        // 培训费
        paidinFee: fee.paidinFee,
        // 说明
        explains: fee.explains,
        // 总费用
        allFee: fee.allFee,
        // 优惠费用
        preferentialFee: fee.preferentialFee,
        // 实缴费用
        realPayFee: fee.realPayFee,
        // 应退费用
        refundableFee: fee.refundableFee,
        // 应扣费用
        deductFee: fee.deductFee,
        // 实退费用
        realRefundFee: fee.realRefundFee,
        // 业绩扣除规则
        performanceFlag: +fee.performanceFlag || "",
        // 退款原因
        refundInfo: fee.refundInfo,
        // 退款信息
        payee: fee.payee,
        studyId: fee.studyId,
        // 驳回信息
        denyReason: fee.denyReason,
      };
    }
    return {
      // id: fee.id,
      stage: fee.stage,
      cost: fee.amount,
      payDate: fee.term,
      isPay: fee.flag,
    };
  });

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      payInfos,
      denyReason: feeInfoData?.denyReason || "",
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "payInfos",
  });

  function handleLookImage(index) {
    setIsVisible(true);
    setImageViewIndex(index);
  }

  async function onFormSubmit(isResolve, data) {
    if (!isResolve && !data.denyReason) {
      toast.show({
        description: "请输入驳回原因",
        placement: "top",
      });
      return;
    }

    const payedMoney = data.payInfos.reduce((costedMoney, fee) => {
      if (fee.isPay) {
        return costedMoney + Number(fee.cost);
      }
      return costedMoney;
    }, 0);

    const otherMoney = +feeInfoData.otherFee || 0;

    if (isResolve && +feeInfoData.realPayFee !== payedMoney + otherMoney) {
      toast.show({
        description: "请确认是否缴费和实缴金额",
        placement: "top",
      });
      return;
    }

    const userInfo = authCtx.userInfo;
    // 报考流程
    const isPassCommitFlag = resolveType === "caiwu" ? 4 : 6;
    const isNoPassCommitFlag = resolveType === "caiwu" ? 3 : 5;

    const commitFlag = !isResolve ? isNoPassCommitFlag : isPassCommitFlag;

    const requestData = {
      studyId: feeInfoData.studyId,
      userId: userInfo.userId,
      checkType: !isResolve ? 2 : 1,
      denyReason: !isResolve ? data.denyReason : "",
      commitFlag,
    };

    const action = resolveType === "caiwu" ? resolveFinance : resolveTeacher;

    setIsLoading(true);

    try {
      await action(requestData, authCtx.token);
      if (isResolve) {
        const updatedFees = defaultValues.fees.map(
          ({ createDate, ...item }, index) => {
            // this.typeName === "fenqi"
            const newData = {
              ...item,
              commitFlag,
            };
            if (commitFlag === 4) {
              newData.flag = data.payInfos[index].isPay;
            }
            return newData;
          }
        );

        await updateFee(updatedFees, authCtx.token);
      }
      toast.show({
        description: isResolve ? "审核成功" : "驳回成功",
        placement: "top",
      });
      onSubmit();
    } catch (error) {
      setIsLoading(false);
      console.log(`error`, error);
    }
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
        borderTopLeftRadius={0}
        backgroundColor="#f2f2f2"
        justifyContent="space-around"
      >
        <Input
          label="姓名"
          textInputConfig={{
            isDisabled: true,
            value: defaultValues.student.name || "",
            placeholder: "请输入姓名",
          }}
        />
        <Input
          label="证件号"
          textInputConfig={{
            isDisabled: true,
            value: defaultValues.student.idNo || "",
            placeholder: "请输入证件号",
          }}
        />
        <Input
          label="手机号"
          textInputConfig={{
            isDisabled: true,
            value: defaultValues.student.phoneNum || "",
            placeholder: "请输入手机号",
          }}
        />
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
        {otherValues.map((c, index) => (
          <Input
            label={c.name}
            key={c.name + index}
            textInputConfig={{
              isDisabled: true,
              value: c.value,
              placeholder: c.placeholder || "",
              multiline: c.multiline,
            }}
          />
        ))}
      </VStack>
      <CollectionFormHeader title="缴费信息" />
      {fields.map((item, index) => (
        <VStack
          key={index}
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
            render={({ field: { onChange, value } }) => (
              <Input
                label="缴费期数"
                textInputConfig={{
                  isDisabled: true,
                  value,
                }}
              />
            )}
            name={`payInfos.${index}.stage`}
          />
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                label="缴费金额"
                textInputConfig={{
                  isDisabled: true,
                  value,
                }}
              />
            )}
            name={`payInfos.${index}.cost`}
          />
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                label="缴费日期"
                textInputConfig={{
                  isDisabled: true,
                  value,
                }}
              />
            )}
            name={`payInfos.${index}.payDate`}
          />

          <Controller
            control={control}
            render={({ field: { onChange, value } }) =>
              isLook || resolveType === "jiaowu" ? (
                <Input
                  label="是否缴费"
                  textInputConfig={{
                    isDisabled: true,
                    value: value === 0 ? "否" : "是",
                  }}
                />
              ) : (
                <Input
                  label="是否缴费"
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
                    onChangeText: onChange,
                    value,
                    type: "Select",
                    placeholder: "请选择是否缴费",
                  }}
                />
              )
            }
            name={`payInfos.${index}.isPay`}
          />
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
        <Input
          label="总费用"
          textInputConfig={{
            isDisabled: true,
            value: feeInfoData?.allFee,
            placeholder: "请输入总费用",
          }}
        />
        <HStack
          marginBottom={2}
          justifyContent="space-between"
          alignItems="stretch"
        >
          <Select
            selectedValue={feeInfoData?.otherName}
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
            isDisabled
            _selectedItem={{
              endIcon: <CheckIcon size="5" />,
            }}
          >
            <Select.Item shadow={2} label="报名费" value="报名费" />
            <Select.Item shadow={2} label="补考费" value="补考费" />
            <Select.Item shadow={2} label="信息采集费" value="信息采集费" />
            <Select.Item shadow={2} label="学历处理费" value="学历处理费" />
          </Select>

          <Input
            label={null}
            textInputConfig={{
              isDisabled: true,
              value: feeInfoData?.otherFee,
              placeholder: "请输入金额",
            }}
          />
        </HStack>
        <Input
          label="培训费"
          textInputConfig={{
            isDisabled: true,
            value: feeInfoData?.paidinFee,
            placeholder: "请输入培训费",
          }}
        />
        <Input
          label="优惠费用"
          textInputConfig={{
            isDisabled: true,
            value: feeInfoData?.preferentialFee,
            placeholder: "请输入优惠费用",
          }}
        />
        <Input
          label="实缴费用"
          textInputConfig={{
            isDisabled: true,
            value: feeInfoData?.realPayFee,
            placeholder: "请输入实缴费用",
          }}
        />
        <Input
          label="备注"
          textInputConfig={{
            isDisabled: true,
            mt: "2",
            w: "100%",
            multiline: true,
            value: feeInfoData?.explains,
            placeholder: "请输入备注",
          }}
        />
      </VStack>

      {businessProgress === 1 && (
        <Fragment>
          <CollectionFormHeader title="退款信息" />
          <VStack
            borderRadius={10}
            paddingX="3"
            paddingTop="5"
            paddingBottom="3"
            marginBottom="4"
            borderTopLeftRadius="0"
            backgroundColor="#f2f2f2"
            justifyContent="space-around"
          >
            <Input
              label="应退费用"
              textInputConfig={{
                isDisabled: true,
                value: feeInfoData?.refundableFee,
              }}
            />
            <Input
              label="应扣费用"
              textInputConfig={{
                isDisabled: true,
                value: feeInfoData?.deductFee,
              }}
            />
            <Input
              label="实退费用"
              textInputConfig={{
                isDisabled: true,
                value: feeInfoData?.realRefundFee,
              }}
            />
            <Input
              label="业绩扣除规则"
              selectOptions={[
                {
                  id: 1,
                  label: "应扣算业绩",
                  value: 1,
                },
                {
                  id: 0,
                  label: "应扣不算业绩",
                  value: 2,
                },
              ]}
              textInputConfig={{
                isDisabled: true,
                type: "Select",
                value: feeInfoData?.performanceFlag,
              }}
            />
            <Input
              label="退款原因"
              textInputConfig={{
                isDisabled: true,
                value: feeInfoData?.refundInfo,
              }}
            />
            <Input
              label="退款信息"
              textInputConfig={{
                isDisabled: true,
                value: feeInfoData?.payee,
              }}
            />
          </VStack>
        </Fragment>
      )}

      {defaultValues.studentCards.length ? (
        <>
          <CollectionFormHeader title="财务凭证" />
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
            {defaultValues.studentCards.map((img, index) => {
              let label = "";
              if (img.property === "jiaofei") {
                label = "缴费凭证";
              } else if (img.property === "youhui") {
                label = "优惠凭证";
              } else if (img.property === "qita") {
                label = "其他凭证";
              } else if (img.property === "tuikuan") {
                label = "退款凭证";
              }

              return (
                <HStack key={index} marginBottom={2}>
                  <FormLabel label={label} />
                  <Pressable onPress={handleLookImage.bind(null, index)}>
                    <Image
                      source={{
                        uri: imageBaseUrl + img.fileResource,
                      }}
                      ml="4"
                      alt={img.property}
                      size="xl"
                    />
                  </Pressable>
                </HStack>
              );
            })}
          </VStack>
        </>
      ) : null}

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
          render={({ field: { onChange, value } }) => (
            <Input
              label={null}
              textInputConfig={{
                isDisabled: isLook,
                mt: "2",
                w: "100%",
                multiline: true,
                onChangeText: onChange,
                value,
                placeholder: "请输入审核意见",
              }}
            />
          )}
          name="denyReason"
        />
      </VStack>

      {!isLook && (
        <HStack marginTop="2" justifyContent="space-between">
          <Button
            borderRadius={10}
            w="45%"
            _text={{ fontWeight: "bold" }}
            colorScheme="blue"
            onPress={handleSubmit(onFormSubmit.bind(null, false))}
          >
            驳回
          </Button>
          <Button
            borderRadius={10}
            w="45%"
            _text={{ fontWeight: "bold" }}
            colorScheme="blue"
            onPress={handleSubmit(onFormSubmit.bind(null, true))}
          >
            审核通过
          </Button>
        </HStack>
      )}

      <ImageView
        images={images}
        imageIndex={imageViewIndex}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </View>
  );
}

export default AuditForm;
