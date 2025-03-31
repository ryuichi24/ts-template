import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app = (await NestFactory.create(AppModule)).setGlobalPrefix("api", {
    exclude: [],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("TS Template API")
    .setDescription("TS Template API description")
    .setVersion("1.0")
    // https://docs.nestjs.com/openapi/security#bearer-authentication
    .addBearerAuth({ type: "http", name: "Authorization", in: "header" }, "Authorization")
    // https://docs.nestjs.com/openapi/security#oauth2-authentication
    .addOAuth2(
      {
        name: "Google OAuth2 (Desktop)",
        type: "oauth2",
        flows: {
          authorizationCode: {
            scopes: ["openid", "profile", "email"],
            authorizationUrl: process.env.DESKTOP_OAUTH_GOOGLE_AUTH_URL,
            tokenUrl: process.env.DESKTOP_OAUTH_GOOGLE_TOKEN_URL,
          },
        },
      },
      "Google OAuth2 (Desktop)",
    )
    .build();

  const swaggerDocumentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, swaggerDocumentFactory, {
    jsonDocumentUrl: "api/docs/json",
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
