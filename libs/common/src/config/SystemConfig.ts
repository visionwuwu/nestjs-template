/** 环境名称 */
export type EnvName = 'development' | 'beta' | 'production' | 'preview';

/** 系统相关配置接口定义 */
export interface ConfigProps {
  /** mongodb 地址 */
  MONGODB_URL: string;
  /** mongodb 端口 */
  MONGODB_PORT: number;
  /** mongodb 数据库名 */
  MONGODB_DATABASE_NAME: string;
  /** mongodb 鉴权用户 */
  MONGODB_USER: string;
  /** mongodb 密码 */
  MONGODB_PASSWORD: string;

  /** admin 接口端口号 */
  ADMIN_PORT: number;
  /** admin 接口请求地址 */
  ADMIN_REQUEST_URL: string;

  /** web 接口端口号 */
  WEB_PORT: number;
  /** web 接口请求地址 */
  WEB_REQUEST_URL: string;

  /** jwt 签名密钥 */
  JWT_SECRET: string;
}

type SystemConfigProps = {
  [key in EnvName]?: ConfigProps;
};

/**
 * 系统相关配置
 *
 * @author Visionwuwu
 */
const SystemConfig: SystemConfigProps = {
  development: {
    MONGODB_URL: 'mongodb://localhost:27017/nestjs-template',
    MONGODB_PORT: 27017,
    MONGODB_DATABASE_NAME: 'nestjs-template',
    MONGODB_USER: 'Visionwuwu',
    MONGODB_PASSWORD: '123456',
    ADMIN_PORT: 5000,
    ADMIN_REQUEST_URL: 'http://localhost:5000',
    WEB_PORT: 3000,
    WEB_REQUEST_URL: 'http://localhost:3000',
    JWT_SECRET: 'yan520',
  },
};

export default SystemConfig;
