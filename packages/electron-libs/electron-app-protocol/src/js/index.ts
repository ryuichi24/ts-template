import path from "path";
import fs, { existsSync } from "fs";
import bindings from "bindings";
import _url from "url";
const __dirname = _url.fileURLToPath(new URL(".", import.meta.url));

const addon = bindings({
  module_root: path.resolve(__dirname, "..", ".."),
  bindings: "electron_app_protocol_configurator.node",
});


interface ProtocolConfigurator {
  configure(): void;
}

const ProtocolConfigurator: {
  new (appBundlePath: string, protocol: string): ProtocolConfigurator;
} = addon.ProtocolConfigurator;

export function registerProtocol(protocol: string): void {
  if (process.platform === `darwin`) {
    registerMacProtocol(protocol);
  }
}

function registerMacProtocol(protocol: string) {
  const appBundlePath = path.resolve(process.execPath, `..`, `..`, `..`);
  const originalInfoPlistFilePath = path.resolve(appBundlePath, `Contents`, `Info.plist.original`);
  const infoPlistFilePath = path.resolve(appBundlePath, `Contents`, `Info.plist`);

  let infoPlistContents = "";

  if (existsSync(originalInfoPlistFilePath)) {
    infoPlistContents = fs.readFileSync(infoPlistFilePath, `utf8`);
  }

  if (!existsSync(originalInfoPlistFilePath)) {
    fs.copyFileSync(infoPlistFilePath, originalInfoPlistFilePath);
    infoPlistContents = fs.readFileSync(infoPlistFilePath, `utf8`);
  }

  infoPlistContents = infoPlistContents.replace(`com.github.Electron`, `com.github.${protocol}`);

  infoPlistContents = infoPlistContents.replace(
    /<\/dict>\n<\/plist>/,
    [
      `    <key>CFBundleURLTypes</key>`,
      `    <array>`,
      `      <dict>`,
      `        <key>CFBundleURLName</key>`,
      `        <string>${protocol}</string>`,
      `        <key>CFBundleURLSchemes</key>`,
      `        <array>`,
      `          <string>${protocol}</string>`,
      `        </array>`,
      `      </dict>`,
      `    </array>`,
      `  </dict>`,
      `</plist>`,
    ].join(`\n`),
  );

  fs.writeFileSync(infoPlistFilePath, infoPlistContents);

  new ProtocolConfigurator(appBundlePath, protocol).configure();
}
