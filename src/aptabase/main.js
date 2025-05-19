const { app, net } = require("electron");
const { getEnvironmentInfo } = require("./lib/env");
const { newSessionId } = require("./lib/session");

// Session expires after 1 hour of inactivity
const SESSION_TIMEOUT = 1 * 60 * 60;
let _sessionId = newSessionId();
let _lastTouched = new Date();
let _appKey = "";
let _apiUrl = "";
let _env;

const _hosts = {
  US: "https://us.aptabase.com",
  EU: "https://eu.aptabase.com",
  DEV: "http://localhost:3000",
  SH: "",
};

module.exports.initialize = async function(
  appKey,
  options,
){
  if (app.isReady()) {
    console.warn(
      "Aptabase: `initialize` must be invoked before the app is ready. Tracking will be disabled."
    );
    return;
  }

  const parts = appKey.split("-");
  if (parts.length !== 3 || _hosts[parts[1]] === undefined) {
    console.warn(
      `Aptabase: App Key "${appKey}" is invalid. Tracking will be disabled.`
    );
    return;
  }

  await app.whenReady();

  const baseUrl = getBaseUrl(parts[1], options);
  _apiUrl = `${baseUrl}/api/v0/event`;
  _env = await getEnvironmentInfo(app);
  _appKey = appKey;

  // some events might be emitted before the initialization is complete
  // so we drain the buffer here
  drainBuffer();
}

const buffer = [];

function trackEvent (
  eventName,
  props
) {
  if (!_appKey || !_env) {
    buffer.push({ eventName, props });
    return Promise.resolve();
  }

  let now = new Date();
  const diffInMs = now.getTime() - _lastTouched.getTime();
  const diffInSec = Math.floor(diffInMs / 1000);
  if (diffInSec > SESSION_TIMEOUT) {
    _sessionId = newSessionId();
  }
  _lastTouched = now;

  const body = {
    timestamp: now.toISOString(),
    sessionId: _sessionId,
    eventName: eventName,
    systemProps: {
      isDebug: _env.isDebug,
      locale: _env.locale,
      osName: _env.osName,
      osVersion: _env.osVersion,
      engineName: _env.engineName,
      engineVersion: _env.engineVersion,
      appVersion: _env.appVersion,
      sdkVersion: _env.sdkVersion,
    },
    props: props,
  };

  return new Promise((resolve) => {
    const onReject = (err) => {
      console.error(`Aptabase: Failed to send event`, err);
      resolve();
    };

    const req = net.request({
      method: "POST",
      url: _apiUrl,
      credentials: "omit",
    });

    req.setHeader("Content-Type", "application/json");
    req.setHeader("App-Key", _appKey);

    req.on("error", onReject);
    req.on("abort", onReject);
    req.on("response", (res) => {
      if (res.statusCode >= 300) {
        console.warn(
          `Aptabase: Failed to send event "${eventName}": ${res.statusCode} ${res.statusMessage}`
        );
      }
      resolve();
    });

    req.write(JSON.stringify(body));
    req.end();
  });
}

function drainBuffer() {
  while (buffer.length > 0) {
    const data = buffer.shift();
    if (data) {
      trackEvent(data.eventName, data.props);
    }
  }
}

function getBaseUrl(
  region,
  options
){
  if (region === "SH") {
    if (!options?.host) {
      console.warn(
        `Aptabase: Host parameter must be defined when using Self-Hosted App Key. Tracking will be disabled.`
      );
      return;
    }
    return options.host;
  }

  return _hosts[region];
}
module.exports.trackEvent = trackEvent