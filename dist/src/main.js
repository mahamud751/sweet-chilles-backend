"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.CORS_ORIGIN ?? true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Savasaachi Growth Engine API')
        .setDescription('Hospitality growth platform — competitions, loyalty vouchers, Gold membership, owner dashboard. White-label per restaurant slug.')
        .setVersion('1.0.0')
        .addBearerAuth()
        .addTag('Restaurants', 'White-label branding')
        .addTag('Auth', 'Member & staff authentication')
        .addTag('Vouchers', 'Wallet & QR redemption')
        .addTag('Competitions', 'Phase 1 acquisition')
        .addTag('Dashboard', 'Owner analytics')
        .addTag('Campaigns', 'AI-style automated engagement')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = Number(process.env.PORT ?? 4000);
    await app.listen(port);
    console.log(`Growth Engine API: http://localhost:${port}`);
    console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}
void bootstrap();
//# sourceMappingURL=main.js.map