export const config = {
  backgroundServer: {
    port: window.EXPOSED.webSocketPort ?? 8080,
    host: "localhost",
    getWsUrl() {
      return `ws://${this.host}:${this.port}/ws`;
    },
  },
  oauth: {
    baseUrl: "http://localhost:3000/api/oauth/login/desktop",
  },
};
