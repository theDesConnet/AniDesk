module.exports.newSessionId = function() {
  const epochInSeconds = Math.floor(Date.now() / 1000).toString();
  const random = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0");

  return epochInSeconds + random;
}