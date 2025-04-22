import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { logger as _logger } from "./logger.js";
import { ILogger } from "@ts-template/logger";
import { MainProcessEventHandler } from "./main-process-event-handler.js";
import {
  CanConstructModule,
  hasOnServerDidClose,
  hasOnServerDidStart,
  hasOnServerWillStart,
  hasOnWSServerDidClose,
  hasOnWSServerDidOpen,
  hasOnWSServerDidReceiveEvent,
  hasOnWSServerDidReceiveMessage,
  IModule,
} from "./lifecycle-events.js";

export class AppServerFactory {
  static create(moduleContainer: CanConstructModule[]) {
    const modules = moduleContainer.map((module) => new module());
    return new AppServer(modules);
  }
}

type AppOptions = {
  /**
   * The port for the server.
   * If 0 is passed as a port to listen to, OS automatically sets a free port.
   * @default 0
   */
  port?: number;
  /**
   * The path for the WebSocket server.
   * @default "/ws"
   */
  wsPath?: string;
  /**
   *
   */
  logger?: ILogger;
  /**
   * The main process event handler.
   */
  mainProcessEventHandler?: MainProcessEventHandler;
};

export interface IAppServer {
  start(options: AppOptions): Promise<void>;
}

export class AppServer implements IAppServer {
  private _runningPort = 0;
  private _wsPath = "/ws";

  constructor(private _modules: IModule[]) {}

  async start(options: AppOptions): Promise<void> {
    const {
      wsPath,
      port = this._runningPort,
      logger = _logger,
      mainProcessEventHandler = new MainProcessEventHandler(),
    } = options;

    // in case ws path is passed
    if (wsPath) {
      {
        this._wsPath = wsPath;
      }

      const appCtx = {
        port,
        wsPath,
        logger,
        mainProcessEventHandler,
      };

      // Call onServerWillStart for all modules
      for (const module of this._modules) {
        if (!hasOnServerWillStart(module)) {
          continue;
        }

        await module.onServerWillStart(
          {
            wsPath: this._wsPath,
          },
          appCtx,
        );
      }

      const app = new Hono();

      const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

      app.get(
        wsPath,
        upgradeWebSocket((c) => {
          // https://hono.dev/helpers/websocket
          return {
            onMessage: ($evt, _ws) => {
              let data = $evt.data;

              // Try to parse the data as JSON
              // If it fails, keep the original data
              try {
                data = JSON.parse($evt.data.toString());
              } catch (error) {}

              for (const module of this._modules) {
                if (hasOnWSServerDidReceiveMessage(module)) {
                  module.onWSServerDidReceiveMessage?.(
                    {
                      ws: _ws,
                      $evt,
                      message: data.toString(),
                    },
                    appCtx,
                  );
                  continue;
                }

                if (hasOnWSServerDidReceiveEvent(module) && hasEventData(data) && data.event === module.event) {
                  module.onWSServerDidReceiveEvent?.(
                    {
                      ws: _ws,
                      data,
                      $evt,
                    },
                    appCtx,
                  );
                }
              }
            },
            onClose: ($evt, _ws) => {
              for (const module of this._modules) {
                if (hasOnWSServerDidClose(module)) {
                  module.onWSServerDidClose?.(
                    {
                      ws: _ws,
                      $evt,
                    },
                    appCtx,
                  );
                }
              }

              console.log("Connection closed");
            },
            onOpen: ($evt, _ws) => {
              console.log("Connection opened");
              for (const module of this._modules) {
                if (hasOnWSServerDidOpen(module)) {
                  module.onWSServerDidOpen?.(
                    {
                      ws: _ws,
                    },
                    appCtx,
                  );
                }
              }
            },
            onError: ($evt, _ws) => {
              console.log("Error occurred");
            },
          };
        }),
      );

      const server = serve(
        {
          fetch: app.fetch,
          port: options.port,
        },
        (info) => {
          logger.info(`Background server is running on port ${info.port}`);
          logger.info(`WebSocket server is running on http://localhost:${info.port}/ws`);
          this._runningPort = info.port;
          for (const module of this._modules) {
            if (!hasOnServerDidStart(module)) {
              continue;
            }

            module.onServerDidStart?.(
              {
                port: this._runningPort,
              },
              appCtx,
            );
          }
        },
      );

      server.on("close", () => {
        for (const module of this._modules) {
          if (!hasOnServerDidClose(module)) {
            continue;
          }

          module.onServerDidClose?.(
            {
              port: this._runningPort,
              wsPath: this._wsPath,
            },
            appCtx,
          );
        }
      });

      server.on("listening", () => {
        logger.info(`Server is listening!`);
      });

      injectWebSocket(server);
    }
  }
}

function hasEventData(data: any): data is { event: string; payload: any } {
  return typeof data === "object" && data !== null && "event" in data && "payload" in data;
}
