import { ScrollView, View } from "native-base";
import { useEffect, useLayoutEffect, useState } from "react";
import CollectionForm from "../components/Collection/CollectionForm";
import Loading from "../components/UI/Loading";
import { OCCUPATION_FORM, OCCUPATION_STATE } from "../constants/collections";
import { pages } from "../constants/page";
import { getBatches, getJobType } from "../fetches";
import { getStudentInfo } from "../fetches/modules/common";
import { commonStyles } from "../styles/common";

function OccupationManage({ navigation, route }) {
  const [collectionFields, setCollectionFields] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const { headerTitle, idNo = "", studyId = "" } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle });
  }, [navigation]);

  useEffect(() => {
    async function fetchData() {
      let jobTypes = await getJobType();
      jobTypes = jobTypes.map((item) => ({
        id: item.id,
        label: item.occupationName,
        value: item.id,
      }));
      let batches = await getBatches("", "occupation");
      batches = batches.map((item) => ({
        id: item.id,
        label: item.batch,
        value: item.batch,
      }));

      let occupationInfoNameOptions = null;
      let studentData = OCCUPATION_STATE;

      if (idNo && studyId) {
        const { professionalTypes, occupationInfoName, ...data } =
          await getFormValue();

        occupationInfoNameOptions = [
          {
            id: "occupationInfoName1",
            label: occupationInfoName,
            value: occupationInfoName,
          },
        ];

        const professionalTypesId = jobTypes.find(
          (item) => item.label === professionalTypes
        );

        studentData = {
          ...data,
          occupationInfoName,
          professionalTypes: professionalTypesId,
        };
      }
      setDefaultValues(studentData);

      const fields = [
        {
          name: "职业类别",
          field: "professionalTypes",
          type: "Select",
          childrenField: "occupationInfoName",
          options: jobTypes,
          placeholder: "请选择",
        },
        {
          name: "报考专业",
          field: "occupationInfoName",
          type: "Select",
          options: occupationInfoNameOptions,
          placeholder: "请选择",
        },
        {
          name: "批次",
          field: "batch",
          type: "Select",
          options: batches,
          placeholder: "请选择",
        },
        {
          name: "报考说明",
          field: "applyExplain",
          type: "Input",
          multiline: true,
          placeholder: "请输入",
        },
      ];
      setIsLoading(false);
      setCollectionFields(fields);
    }

    setIsLoading(true);
    fetchData();
  }, []);

  async function getFormValue() {
    const response = await getStudentInfo({
      idNo,
      trainType: OCCUPATION_FORM,
      studyId,
    });

    let feeInfoData = null;
    const payInfos = response.fees.map((fee) => {
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
          studyId: fee.studyId,
          // 驳回信息
          denyReason: fee.denyReason,
        };
      }
      return {
        id: fee.id,
        stage: fee.stage,
        cost: fee.amount,
        payDate: fee.term,
        isPay: fee.flag,
      };
    });

    const data = response.studentOccupation;

    return {
      id: response.student.id,
      name: response.student.name,
      idNum: response.student.idNo,
      phone: response.student.phoneNum,
      // app不需要更新的字段
      appDoNotNeedFields: {
        nation: response.student.nation,
        sex: response.student.sex,
        birthday: response.student.birthday,
        address: response.student.address,
        email: response.student.email,
        qqNumber: response.student.qqNumber,
        workAdress: response.student.workAdress,
        // 学历1
        major: response.student.major,
        educationName: response.student.educationName,
        studyMode: response.student.studyMode,
        graduateSchool: response.student.graduateSchool,
        graduateTime: response.student.graduateTime,
        certificateNumber: response.student.certificateNumber,
        // 学历2
        major2: response.student.major2,
        educationName2: response.student.educationName2,
        studyMode2: response.student.studyMode2,
        graduateSchool2: response.student.graduateSchool2,
        graduateTime2: response.student.graduateTime2,
        certificateNumber2: response.student.certificateNumber2,
      },
      // 总费用
      allCost: feeInfoData.allFee,
      // 费用类别
      costType: feeInfoData.otherName,
      // 其他费用
      cost: feeInfoData.otherFee,
      // 培训费
      cultivateCost: feeInfoData.paidinFee,
      // 优惠费用
      costOffer: feeInfoData.preferentialFee,
      // 实缴费用
      finishCost: feeInfoData.realPayFee,
      // 备注
      remark: feeInfoData.explains,
      // 驳回信息
      denyReason: feeInfoData.denyReason,
      payInfos,
      studentInfoId: data.id,
      professionalTypes: data.professionalTypes,
      occupationInfoName: data.majorName,
      batch: data.batch,
      applyExplain: data.applyExplain,
    };
  }

  function handleSubmit() {
    // navigation.navigate(pages.COLLECTION_HOME);
    navigation.goBack();
  }

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={commonStyles.container}>
        {collectionFields && (
          <CollectionForm
            defaultValues={defaultValues}
            defaultLabels={collectionFields}
            collectionType={OCCUPATION_FORM}
            isUpdate={idNo && studyId}
            onSubmit={handleSubmit}
          />
        )}
      </View>
    </ScrollView>
  );
}

export default OccupationManage;
