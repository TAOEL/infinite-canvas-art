const { app, BrowserWindow, protocol, net } = require("electron");
const path = require("path");
const fs = require("fs");
const { pathToFileURL } = require("url");

const LOG = path.join(__dirname, "..", "main-debug.log");
function log(msg) {
    try { fs.appendFileSync(LOG, `[${new Date().toISOString()}] ${msg}\n`); } catch {}
}

log("main starting");

const APP_SCHEME = "app";
const APP_HOST = "localhost";
const DIST_DIR = path.join(__dirname, "app");

log(`DIST_DIR=${DIST_DIR} exists=${fs.existsSync(DIST_DIR)}`);
log(`index.html exists=${fs.existsSync(path.join(DIST_DIR, "index.html"))}`);

protocol.registerSchemesAsPrivileged([
    {
        scheme: APP_SCHEME,
        privileges: {
            standard: true,
            secure: true,
            supportFetchAPI: true,
            corsEnabled: true,
            stream: true,
        },
    },
]);

function resolveDistFile(urlPath) {
    let rel = decodeURIComponent(urlPath.split("?")[0]);
    if (rel === "/" || rel === "") rel = "/index.html";
    const resolved = path.normalize(path.join(DIST_DIR, rel));
    if (!resolved.startsWith(DIST_DIR)) return null;
    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) return resolved;
    const indexHtml = path.join(DIST_DIR, "index.html");
    if (fs.existsSync(indexHtml)) return indexHtml;
    return null;
}

let win = null;

function createWindow() {
    log("createWindow called");
    try {
        win = new BrowserWindow({
            width: 1440,
            height: 900,
            minWidth: 1024,
            minHeight: 640,
            backgroundColor: "#0b0d10",
            autoHideMenuBar: true,
            show: true,
            icon: path.join(__dirname, "build", "icon.ico"),
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                sandbox: false,
            },
        });
        log(`window created, loading url`);
        win.loadURL(`${APP_SCHEME}://${APP_HOST}/`).then(() => {
            log("loadURL resolved");
        }).catch((err) => {
            log(`loadURL error: ${err.message}`);
        });
        win.webContents.on("did-fail-load", (e, code, desc) => {
            log(`did-fail-load: ${code} ${desc}`);
        });
        win.webContents.on("console-message", (e, level, message) => {
            log(`renderer console: ${message}`);
        });
    } catch (err) {
        log(`createWindow error: ${err.stack}`);
    }
}

app.whenReady().then(() => {
    log("app ready");
    try {
        protocol.handle(APP_SCHEME, (request) => {
            const url = new URL(request.url);
            const filePath = resolveDistFile(url.pathname);
            log(`protocol: ${request.url} -> ${filePath}`);
            if (!filePath) {
                return new Response("Not Found", { status: 404 });
            }
            return net.fetch(pathToFileURL(filePath).toString());
        });
        log("protocol registered");
    } catch (err) {
        log(`protocol error: ${err.stack}`);
    }
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    log("all windows closed");
    if (process.platform !== "darwin") app.quit();
});

app.on("ready-to-show", () => log("ready-to-show"));
