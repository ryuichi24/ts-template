import { AppServerFactory } from "./utils/app-server-factory.js";
import { HandleOpenInBrowserRequestModule } from "./features/handle-open-in-browser-request.module.js";
import { NotifyMainProcessAboutServerStartedModule } from "./features/notify-main-process-about-server-started.module.js";
import { HandleOauthLoginSuccessRedirectModule } from "./features/handle-oauth-login-success-redirect.module.js";
import { HandleCheckAuthRequestModule } from "./features/handle-check-auth-request.module.js";
import { HandleLogoutRequestModule } from "./features/handle-logout-request.module.js";
import { HandlePopulateDatabaseModule } from "./features/database/handle-populate-database.module.js";
import { HandleLogDataRequestedModule } from "./features/log/handle-log-data-requested.module.js";

async function bootstrap() {
  const app = AppServerFactory.create([
    NotifyMainProcessAboutServerStartedModule,
    HandleOpenInBrowserRequestModule,
    HandleOauthLoginSuccessRedirectModule,
    HandleCheckAuthRequestModule,
    HandleLogoutRequestModule,
    HandlePopulateDatabaseModule,
    HandleLogDataRequestedModule,
  ]);

  await app.start({
    port: 0,
    wsPath: "/ws",
  });
}

bootstrap();
