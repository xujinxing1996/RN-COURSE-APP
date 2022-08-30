import { ScrollView, View } from "native-base";
import { useEffect, useLayoutEffect, useState } from "react";
import CollectionForm from "../components/Collection/CollectionForm";
import { EDUCATION_FORM, EDUCATION_STATE } from "../constants/collections";
import { commonStyles } from "../styles/common";
import { pages } from "../constants/page";
import { getEducationLevel, getStudyType } from "../fetches";
import { getStudentInfo } from "../fetches/modules/common";
import Loading from "../components/UI/Loading";

function EducationManage({ navigation, route }) {
  const [isLoading, setIsLoading] = useState(false);
  const [collectionFields, setCollectionFields] = useState(null);
  const [defaultValues, setDefaultValues] = useState(null);
  const { headerTitle, idNo = "", studyId = "" } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle });
  }, [navigation]);

  useEffect(() => {
    async function fetchData() {
      let studyTypes = await getStudyType();
      studyTypes = studyTypes.map((item) => ({
        id: item.id,
        label: item.mode,
        value: item.id,
      }));
      let educationLevels = await getEducationLevel();
      educationLevels = educationLevels.map((item) => ({
        id: item.id,
        label: item.educationName,
        value: item.id,
      }));

      let batchOptions = null;
      let schoolNameOptions = null;
      let courseNameOptions = null;
      let studentData = EDUCATION_STATE;

      if (idNo && studyId) {
        const {
          batch,
          schoolName,
          courseName,
          studyType,
          educationLevel,
          ...data
        } = await getFormValue();

        batchOptions = [
          {
            id: "batch1",
            label: batch,
            value: batch,
          },
        ];

        schoolNameOptions = [
          {
            id: "schoolName1",
            label: schoolName,
            value: schoolName,
          },
        ];

        courseNameOptions = [
          {
            id: "majorName1",
            label: courseName,
            value: courseName,
          },
        ];

        const studyTypeId = studyTypes.find((item) => item.label === studyType);

        const educationLevelId = educationLevels.find(
          (item) => item.label === educationLevel
        );

        studentData = {
          ...data,
          batch,
          courseName,
          studyType: studyTypeId,
          educationLevel: educationLevelId,
          schoolName: { label: schoolName, value: schoolName },
        };
      }
      setDefaultValues(studentData);

      const fields = [
        {
          name: "学习形式",
          field: "studyType",
          type: "Select",
          childrenField: "batch",
          options: studyTypes,
          placeholder: "请选择",
        },
        {
          name: "批次",
          field: "batch",
          type: "Select",
          options: batchOptions,
          placeholder: "请选择",
        },
        {
          name: "学历层次",
          field: "educationLevel",
          type: "Select",
          isChildrenValueForId: true,
          childrenField: "schoolName",
          options: educationLevels,
          placeholder: "请选择",
        },
        {
          name: "学校",
          field: "schoolName",
          type: "Select",
          childrenField: "courseName",
          options: schoolNameOptions,
          placeholder: "请选择",
        },
        {
          name: "专业",
          field: "courseName",
          type: "Select",
          options: courseNameOptions,
          placeholder: "请选择",
        },
      ];
      setCollectionFields(fields);
      setIsLoading(false);
    }

    setIsLoading(true);

    fetchData();
  }, []);

  async function getFormValue() {
    const response = await getStudentInfo({
      idNo,
      trainType: EDUCATION_FORM,
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

    const data = response.studentEducation;

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
      batch: data.batch,
      courseName: data.majorName,
      schoolName: data.schoolName,
      studyType: data.studyMode,
      educationLevel: data.educationName,
    };
  }

  async function handleSubmit() {
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
            collectionType={EDUCATION_FORM}
            isUpdate={idNo && studyId}
            onSubmit={handleSubmit}
          />
        )}
      </View>
    </ScrollView>
  );
}

export default EducationManage;
