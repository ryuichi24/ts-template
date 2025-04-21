type EventPayload = { event: string; payload: any };

type Observer = (payload: any) => void;

export class WebSocketChannel {
  private _ws: WebSocket;
  private _queue: EventPayload[] = [];
  private _observers: Map<string, Set<Observer>> = new Map();
  private _url: string;
  private _reconnect: boolean;
  private _reconnectDelay = 1000;

  constructor(url: string, reconnect: boolean = false) {
    this._url = url;
    this._reconnect = reconnect;

    this._ws = this.createWebSocket();
  }

  private createWebSocket(): WebSocket {
    const ws = new WebSocket(this._url);

    ws.addEventListener("open", (evt) => {
      this.flushQueue();
      this.emitToObservers("open", { $evt: evt });
    });

    ws.addEventListener("message", (evt) => {
      try {
        const data = JSON.parse(evt.data);
        this.emitToObservers(data.event, { data: data });
      } catch (err) {
        const data = JSON.parse(evt.data);
      }
    });

    ws.addEventListener("close", (evt) => {
      this.emitToObservers("close", { $evt: evt });

      if (this._reconnect) {
        setTimeout(() => {
          console.log("Reconnecting...");
          this._ws = this.createWebSocket();
        }, this._reconnectDelay);
      }
    });

    ws.addEventListener("error", (evt) => {
      this.emitToObservers("error", { $evt: evt });
    });

    return ws;
  }

  public emit(event: string, payload: any = {}) {
    const message = { event, payload };

    if (this._ws.readyState === WebSocket.OPEN) {
      this._ws.send(JSON.stringify(message));
    } else {
      this._queue.push(message);
    }
  }

  private flushQueue() {
    while (this._queue.length > 0) {
      const msg = this._queue.shift();
      if (msg) {
        this._ws.send(JSON.stringify(msg));
      }
    }
  }

  public on(event: string, handler: Observer, options: { signal?: AbortSignal } = {}) {
    if (!this._observers.has(event)) {
      this._observers.set(event, new Set());
    }
    this._observers.get(event)?.add(handler);

    if (options.signal) {
      options.signal.addEventListener("abort", () => {
        this.off(event, handler);
      });
    }
  }

  public off(event: string, handler: Observer) {
    this._observers.get(event)?.delete(handler);
  }

  private emitToObservers(event: string, payload: any) {
    const handlers = this._observers.get(event);
    if (handlers) {
      handlers.forEach((fn) => fn(payload));
    }
  }

  public close(code?: number, reason?: string) {
    this._ws.close(code, reason);
  }

  public get readyState() {
    return this._ws.readyState;
  }
}
