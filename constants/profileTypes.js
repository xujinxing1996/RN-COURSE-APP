//处于开发模式时，屏蔽轮询
const PROFILE_DEVELOPMENT = "development";
//处于开发模式时，开启轮询
const PROFILE_PRODUCTION = "production";
//处于管理员模式时，可模拟登录其他用户，管理员模式版本应用不上架应用
const PROFILE_ADMIN = "admin";
const profileTypes = {
  PROFILE_DEVELOPMENT,
  PROFILE_PRODUCTION,
  PROFILE_ADMIN,
};
export { profileTypes };
