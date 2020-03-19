import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const swaggerOptions = new DocumentBuilder()
        .setTitle('Tribe Interview API')
        .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);

    SwaggerModule.setup('doc', app, swaggerDocument);

    await app.listen(3000);
}
bootstrap();
