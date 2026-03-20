import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "@/shared/infrastructure/filters/all-exceptions.filter";
import { RollbarService } from "@/shared/infrastructure/rollbar/rollbar.service";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Register global validation pipe so DTO decorators are enforced
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Register global exception filter
  const rollbarService = app.get(RollbarService);
  app.useGlobalFilters(new AllExceptionsFilter(rollbarService));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
