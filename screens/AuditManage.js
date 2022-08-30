import { ScrollView, View } from "native-base";
import { useLayoutEffect, useState } from "react";
import { EDUCATION_FORM } from "../constants/collections";
import { commonStyles } from "../styles/common";
import AuditForm from "../components/Collection/AuditForm";
import { getStudentInfo } from "../fetches/modules/common";
import Loading from "../components/UI/Loading";

function AuditManage({ navigation, route }) {
  const {
    headerTitle = "",
    trainType = "",
    idNo = "",
    studyId = "",
    businessProgress = "",
    isLook = false,
  } = route.params;
  const [defaultValues, setDefaultValues] = useState(null);
  const [otherValues, setOtherValues] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle,
    });

    async function fetched() {
      const response = await getStudentInfo({
        idNo,
        trainType,
        studyId,
      });

      let studentCards = [];
      if (response.studentCards) {
        const payImg = response.studentCards.find(
          (img) => img.property === "jiaofei"
        );
        const saleImg = response.studentCards.find(
          (img) => img.property === "youhui"
        );
        const otherImg = response.studentCards.find(
          (img) => img.property === "qita"
        );
        const refundImg = response.studentCards.find(
          (img) => img.property === "tuikuan"
        );

        studentCards = [payImg, saleImg, otherImg, refundImg].reduce(
          (prev, current) => {
            if (current) {
              return prev.concat(current);
            }
            return prev;
          },
          []
        );
      }

      response.studentCards = studentCards;
      setDefaultValues(response);

      const educationData = response.studentEducation;
      const trainData = response.studentTrain;
      const titleData = response.studentTitle;
      const occuData = response.studentOccupation;
      if (educationData) {
        setOtherValues([
          {
            name: "学习形式",
            placeholder: "请选择",
            value: educationData.studyMode,
          },
          {
            name: "批次",
            placeholder: "请选择",
            value: educationData.batch,
          },
          {
            name: "学历层次",
            placeholder: "请选择",
            value: educationData.educationName,
          },
          {
            name: "学校",
            placeholder: "请选择",
            value: educationData.schoolName,
          },
          {
            name: "专业",
            placeholder: "请选择",
            value: educationData.majorName,
          },
        ]);
      } else if (trainData) {
        setOtherValues([
          {
            name: "报考项目",
            placeholder: "请选择",
            value: trainData.applyProject,
          },
          {
            name: "考试科目",
            placeholder: "请选择",
            value: trainData.examCourse,
          },
          {
            name: "班次",
            placeholder: "请选择",
            value: trainData.classs,
          },
          {
            name: "批次",
            placeholder: "请选择",
            value: trainData.batch,
          },
          {
            name: "报考类型",
            placeholder: "请选择",
            value: trainData.applyAssist,
          },
          {
            name: "开始时间",
            value: trainData.startDate,
          },
          {
            name: "结束时间",
            value: trainData.endDate,
          },
        ]);
      } else if (titleData) {
        setOtherValues([
          {
            name: "职称等级",
            placeholder: "请选择",
            value: titleData.professionalLevel,
          },
          {
            name: "职称系列",
            placeholder: "请选择",
            value: titleData.professionalSeries,
          },
          {
            name: "报考专业",
            placeholder: "请选择",
            value: titleData.majorName,
          },
          {
            name: "批次",
            placeholder: "请选择",
            value: titleData.batch,
          },
        ]);
      } else if (occuData) {
        setOtherValues([
          {
            name: "职业类别",
            placeholder: "请选择",
            value: occuData.professionalTypes,
          },
          {
            name: "报考专业",
            placeholder: "请选择",
            value: occuData.majorName,
          },
          {
            name: "批次",
            placeholder: "请选择",
            value: occuData.batch,
          },
          {
            name: "报考说明",
            placeholder: "请输入",
            multiline: true,
            value: occuData.applyExplain,
          },
        ]);
      }
    }
    if (trainType && idNo && studyId) {
      fetched();
    }
  }, []);

  async function handleSubmit() {
    navigation.goBack();
  }

  if (!defaultValues) {
    return <Loading loading loadingText="加载中" />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={commonStyles.container}>
        <AuditForm
          defaultValues={defaultValues}
          otherValues={otherValues}
          businessProgress={businessProgress}
          isLook={isLook}
          onSubmit={handleSubmit}
        />
      </View>
    </ScrollView>
  );
}

export default AuditManage;
