import { ScrollView, View } from "native-base";
import { useEffect, useLayoutEffect, useState } from "react";
import CollectionForm from "../components/Collection/CollectionForm";
import Loading from "../components/UI/Loading";
import { TRAIN_FORM, TRAIN_STATE } from "../constants/collections";
import { pages } from "../constants/page";
import { getBatches, getClasssList, getTrainList } from "../fetches";
import { getStudentInfo } from "../fetches/modules/common";
import { commonStyles } from "../styles/common";

function TrainManage({ navigation, route }) {
  const [collectionFields, setCollectionFields] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const { headerTitle, idNo = "", studyId = "" } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle });
  }, [navigation]);

  useEffect(() => {
    async function fetchData() {
      let trainList = await getTrainList();
      trainList = trainList.map((item) => ({
        id: item.id,
        label: item.trainName,
        value: item.id,
      }));

      let classsList = await getClasssList();
      classsList = classsList.map((item) => ({
        id: item.id,
        label: item.classs,
        value: item.classs,
      }));

      let batches = await getBatches("", "train");
      batches = batches.map((item) => ({
        id: item.id,
        label: item.batch,
        value: item.batch,
      }));

      const applyAssistList = [
        {
          id: "1",
          label: "报考",
          value: "报考",
        },
        {
          id: "2",
          label: "培训",
          value: "培训",
        },
        {
          id: "3",
          label: "培训加报考",
          value: "培训加报考",
        },
      ];

      let trainInfoNameOptions = null;
      let studentData = TRAIN_STATE;

      if (idNo && studyId) {
        const { applyProject, trainInfoName, ...data } = await getFormValue();

        trainInfoNameOptions = trainInfoName.map((tin, index) => ({
          id: "trainInfoName" + index,
          label: tin,
          value: tin,
        }));
        // trainInfoNameOptions = [
        //   {
        //     id: "trainInfoName1",
        //     label: trainInfoName,
        //     value: trainInfoName,
        //   },
        // ];

        const applyProjectId = trainList.find(
          (item) => item.label === applyProject
        );

        studentData = {
          ...data,
          applyProject: applyProjectId,
          trainInfoName,
        };
      }
      setDefaultValues(studentData);

      const fields = [
        {
          name: "报考项目",
          field: "applyProject",
          type: "Select",
          options: trainList,
          childrenField: "trainInfoName",
          placeholder: "请选择",
        },
        {
          name: "考试科目",
          field: "trainInfoName",
          type: "MultiSelect",
          options: trainInfoNameOptions,
          placeholder: "请选择",
        },
        {
          name: "班次",
          field: "classs",
          type: "Select",
          options: classsList,
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
          name: "报考类型",
          field: "applyAssist",
          type: "Select",
          options: applyAssistList,
          placeholder: "请选择",
        },
        {
          name: "开始时间",
          field: "startDate",
          type: "Date",
        },
        {
          name: "结束时间",
          field: "endDate",
          type: "Date",
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
      trainType: TRAIN_FORM,
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

    const data = response.studentTrain;

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
      applyProject: data.applyProject,
      trainInfoName: data.examCourse.split(","),
      classs: data.classs,
      batch: data.batch,
      applyAssist: data.applyAssist,
      startDate: data.startDate,
      endDate: data.endDate,
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
            collectionType={TRAIN_FORM}
            isUpdate={idNo && studyId}
            onSubmit={handleSubmit}
          />
        )}
      </View>
    </ScrollView>
  );
}

export default TrainManage;
