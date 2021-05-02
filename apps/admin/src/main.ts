import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'libs/common/filters/HttpException.filter';
import { ApiParamsValidationPipe } from 'libs/common/pipes/api-params-validation.pipe';
import { AdminModule } from './admin.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AdminModule);

  // 开启跨域包
  app.enableCors();

  // 开启静态资源文件托管
  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });

  // 全局验证管道
  app.useGlobalPipes(new ApiParamsValidationPipe());
  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 接口前缀
  // app.setGlobalPrefix('/api');

  // 配置swagger文档
  const options = new DocumentBuilder()
    .setTitle('NestJs内容管理系统(CMS)模板文档')
    .setDescription('一个基于nestjs开发的CMS后端接口')
    .setVersion('0.1.0')
    .addTag('nestjs后端接口文档')
    .addBearerAuth()
    .build();
  const docuemnt = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('cms-docs', app, docuemnt);

  const PORT = process.env.ADMIN_PORT || 5000;
  const ADMIN_URL = process.env.ADMIN_URL;

  await app.listen(PORT);
  console.log(ADMIN_URL);
}
bootstrap();
