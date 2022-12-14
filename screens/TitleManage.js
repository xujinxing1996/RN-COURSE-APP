import { ScrollView, View } from "native-base";
import { useEffect, useLayoutEffect, useState } from "react";
import CollectionForm from "../components/Collection/CollectionForm";
import Loading from "../components/UI/Loading";
import { TITLE_FORM, TITLE_STATE } from "../constants/collections";
import { pages } from "../constants/page";
import {
  getBatches,
  getProfessionalSeriesList,
  getTitleList,
} from "../fetches";
import { getStudentInfo } from "../fetches/modules/common";
import { commonStyles } from "../styles/common";

function TitleManage({ navigation, route }) {
  const [collectionFields, setCollectionFields] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const { headerTitle, idNo = "", studyId = "" } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle });
  }, [navigation]);

  useEffect(() => {
    async function fetchData() {
      let titleList = await getTitleList();
      titleList = titleList.map((item) => ({
        id: item.id,
        label: item.titleName,
        value: item.titleName,
      }));

      let professionSeries = await getProfessionalSeriesList();
      professionSeries = professionSeries.map((item) => ({
        id: item.id,
        label: item.professionalSeries,
        value: item.id,
      }));

      let batches = await getBatches("", "title");
      batches = batches.map((item) => ({
        id: item.id,
        label: item.batch,
        value: item.batch,
      }));

      let occupationInfoNameOptions = null;
      let studentData = TITLE_STATE;

      if (idNo && studyId) {
        const { professionalSeries, occupationInfoName, ...data } =
          await getFormValue();

        occupationInfoNameOptions = [
          {
            id: "occupationInfoName1",
            label: occupationInfoName,
            value: occupationInfoName,
          },
        ];

        const professionalSeriesId = professionSeries.find(
          (item) => item.label === professionalSeries
        );

        studentData = {
          ...data,
          professionalSeries: professionalSeriesId,
          occupationInfoName,
        };
      }
      setDefaultValues(studentData);

      const fields = [
        {
          name: "????????????",
          field: "professionalLevel",
          type: "Select",
          options: titleList,
          placeholder: "?????????",
        },
        {
          name: "????????????",
          field: "professionalSeries",
          type: "Select",
          childrenField: "occupationInfoName",
          options: professionSeries,
          placeholder: "?????????",
        },
        {
          name: "????????????",
          field: "occupationInfoName",
          type: "Select",
          options: occupationInfoNameOptions,
          placeholder: "?????????",
        },
        {
          name: "??????",
          field: "batch",
          type: "Select",
          options: batches,
          placeholder: "?????????",
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
      trainType: TITLE_FORM,
      studyId,
    });

    let feeInfoData = null;
    const payInfos = response.fees.map((fee) => {
      if (!feeInfoData) {
        feeInfoData = {
          // ????????????
          otherName: fee.otherName,
          // ?????????
          otherFee: fee.otherFee,
          // ?????????
          paidinFee: fee.paidinFee,
          // ??????
          explains: fee.explains,
          // ?????????
          allFee: fee.allFee,
          // ????????????
          preferentialFee: fee.preferentialFee,
          // ????????????
          realPayFee: fee.realPayFee,
          studyId: fee.studyId,
          // ????????????
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

    const data = response.studentTitle;

    return {
      id: response.student.id,
      name: response.student.name,
      idNum: response.student.idNo,
      phone: response.student.phoneNum,
      // app????????????????????????
      appDoNotNeedFields: {
        nation: response.student.nation,
        sex: response.student.sex,
        birthday: response.student.birthday,
        address: response.student.address,
        email: response.student.email,
        qqNumber: response.student.qqNumber,
        workAdress: response.student.workAdress,
        // ??????1
        major: response.student.major,
        educationName: response.student.educationName,
        studyMode: response.student.studyMode,
        graduateSchool: response.student.graduateSchool,
        graduateTime: response.student.graduateTime,
        certificateNumber: response.student.certificateNumber,
        // ??????2
        major2: response.student.major2,
        educationName2: response.student.educationName2,
        studyMode2: response.student.studyMode2,
        graduateSchool2: response.student.graduateSchool2,
        graduateTime2: response.student.graduateTime2,
        certificateNumber2: response.student.certificateNumber2,
      },
      // ?????????
      allCost: feeInfoData.allFee,
      // ????????????
      costType: feeInfoData.otherName,
      // ????????????
      cost: feeInfoData.otherFee,
      // ?????????
      cultivateCost: feeInfoData.paidinFee,
      // ????????????
      costOffer: feeInfoData.preferentialFee,
      // ????????????
      finishCost: feeInfoData.realPayFee,
      // ??????
      remark: feeInfoData.explains,
      // ????????????
      denyReason: feeInfoData.denyReason,
      payInfos,
      studentInfoId: data.id,
      professionalLevel: data.professionalLevel,
      professionalSeries: data.professionalSeries,
      occupationInfoName: data.majorName,
      batch: data.batch,
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
            collectionType={TITLE_FORM}
            isUpdate={idNo && studyId}
            onSubmit={handleSubmit}
          />
        )}
      </View>
    </ScrollView>
  );
}

export default TitleManage;
