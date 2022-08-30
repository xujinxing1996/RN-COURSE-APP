import { activeProfile } from "../constants/activeProfile";
import { API_URL } from "../constants/apiConfig";
import { profileTypes } from "../constants/profileTypes";

const url = API_URL;
const GET = "GET";
const POST = "POST";
const PUT = "PUT";
const DELETE = "DELETE";

const MAX_TIMEOUT = 30000;
const CODE_200 = 200;
const CODE_201 = 201;
const fetchNumber = { MAX_TIMEOUT, CODE_200, CODE_201 };

const production = profileTypes.PROFILE_PRODUCTION;
const PREFIX = activeProfile === production ? "/api" : "/";
const baseUrl = `${url}${PREFIX}`;
const imageBaseUrl = baseUrl + "studentInfo/picDownload?url=";
export { baseUrl, imageBaseUrl, GET, POST, PUT, DELETE, fetchNumber };
