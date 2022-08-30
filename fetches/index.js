import {
  getFinanceList,
  submitCollection,
  submitFee,
  updateFee,
} from "./modules/common";
import {
  getStudyType,
  getBatches,
  getEducationLevel,
  getSchoolNames,
  getMajorNames,
} from "./modules/education";
import { resolveFinance } from "./modules/finance";
import { getJobType, getOccupationMajorTypes } from "./modules/occupation";
import { getTitleList, getProfessionalSeriesList } from "./modules/title";
import { getTrainList, getClasssList, getExamList } from "./modules/train";
import { resolveTeacher } from "./modules/teacher";
import { uploadReceiptFile } from "./modules/receipt";

export {
  getStudyType,
  getBatches,
  getEducationLevel,
  getSchoolNames,
  getMajorNames,
  getJobType,
  getOccupationMajorTypes,
  getTitleList,
  getProfessionalSeriesList,
  getTrainList,
  getClasssList,
  getExamList,
  submitCollection,
  submitFee,
  updateFee,
  getFinanceList,
  resolveFinance,
  resolveTeacher,
  uploadReceiptFile,
};
