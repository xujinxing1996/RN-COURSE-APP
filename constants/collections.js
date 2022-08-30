export const EDUCATION_FORM = "education";
export const OCCUPATION_FORM = "occupation";
export const TITLE_FORM = "title";
export const TRAIN_FORM = "train";

export const PAY_INFOS_STATE = [
  {
    stage: "",
    cost: "",
    payDate: "",
    isPay: 0,
  },
];

export const APP_DO_NOT_NEED_STATE = {
  nation: "",
  sex: "",
  birthday: "",
  address: "",
  email: "",
  qqNumber: "",
  workAdress: "",
  // 学历1
  major: "",
  educationName: "",
  studyMode: "",
  graduateSchool: "",
  graduateTime: "",
  certificateNumber: "",
  // 学历2
  major2: "",
  educationName2: "",
  studyMode2: "",
  graduateSchool2: "",
  graduateTime2: "",
  certificateNumber2: "",
};

export const COMMON_STATE = {
  name: "",
  idNum: "",
  phone: "",
  allCost: "",
  costType: "",
  cost: "",
  cultivateCost: "",
  costOffer: "",
  finishCost: "",
  remark: "",
};

export const EDUCATION_STATE = {
  ...COMMON_STATE,
  payInfos: [...PAY_INFOS_STATE],
  appDoNotNeedFields: {
    ...APP_DO_NOT_NEED_STATE,
  },
  // 特定
  studyType: null,
  batch: "",
  educationLevel: null,
  schoolName: null,
  courseName: "",
};

export const OCCUPATION_STATE = {
  ...COMMON_STATE,
  payInfos: [...PAY_INFOS_STATE],
  appDoNotNeedFields: {
    ...APP_DO_NOT_NEED_STATE,
  },
  // 特定
  professionalTypes: null,
  occupationInfoName: "",
  batch: "",
  applyExplain: "",
};

export const TITLE_STATE = {
  ...COMMON_STATE,
  payInfos: [...PAY_INFOS_STATE],
  appDoNotNeedFields: {
    ...APP_DO_NOT_NEED_STATE,
  },
  // 特定
  professionalLevel: "",
  professionalSeries: null,
  occupationInfoName: "",
  batch: "",
};

export const TRAIN_STATE = {
  ...COMMON_STATE,
  payInfos: [...PAY_INFOS_STATE],
  appDoNotNeedFields: {
    ...APP_DO_NOT_NEED_STATE,
  },
  // 特定
  applyProject: null,
  trainInfoName: [],
  classs: "",
  batch: "",
  applyAssist: "",
  startDate: "",
  endDate: "",
};
