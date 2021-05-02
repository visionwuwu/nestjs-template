/**
 * 通用系统常量
 *
 * @author Visionwuwu
 */
export default class Constants {
  /** http请求 */
  public static readonly HTTP = 'http:';

  /** 文件上传目录 */
  public static readonly UPLOAD_DIR = 'uploads';

  /** 文件上传路径前缀 */
  public static readonly UPLOAD_PREFIX = '/uploads';

  /** Swagger文档标题 */
  public static readonly SWAGGER_DOC_TITLE = 'NestJs内容管理系统(CMS)模板文档';

  /** Swagger文档描述 */
  public static readonly SWAGGER_DOC_DESCRIPTION =
    '一个基于nestjs开发的CMS后端接口';

  /** Swagger文档版本 */
  public static readonly SWAGGER_DOC_VERSION = '0.0.1';

  /** Swagger文档tag */
  public static readonly SWAGGER_DOC_TAG = 'nestjs后端接口文档';

  /** Swagger文档路径 */
  public static readonly SWAGGER_DOC_PATH = 'cms-docs';
}
