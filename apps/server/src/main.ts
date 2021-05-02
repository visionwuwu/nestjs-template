import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 启用跨域包
  app.enableCors();

  // 开启静态资源文件托管
  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });

  // 配置全局api前缀
  // app.setGlobalPrefix("api")

  // 绑定全局验证管道
  app.useGlobalPipes(new ValidationPipe());

  /* 配置swagger文档 */
  const options = new DocumentBuilder()
    .setTitle('blog-nest前端接口文档')
    .setDescription('学习全栈之巅nestjs课堂练习blog')
    .setVersion('0.1.0')
    .addTag('博客接口文档')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  const PORT = process.env.WEB_PORT;
  await app.listen(PORT);
  console.log(process.env.WEB_URL);
}
bootstrap();
