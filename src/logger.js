const log4js = require('log4js');
let logger_config = require("../logger.config.json");
let logger_levels;


log4js.configure(logger_config);
log4js.configuration = logger_config;

process.on('uncaughtException', function (err) {
  log4js.getLogger("uncaughtException").error(err.name, err.message, "\n", err.stack);
  if (typeof global.it !== 'function') { // if not running mocha should exit.
    console.log("Error del programa");
    log4js.shutdown(function () { process.exit(1); });
  }
});

let log = log4js.getLogger("logger");

try {
  logger_levels = require('../logger.levels.json');
} catch (e) {
  logger_levels = { };
  log.warn("Can't load local logger.levels.json (probably doesn't exist.)", e)
}


function getLoggerLevel(name) {
  // retorna el primer valor que exista: 
  return  process.env["DL_" + name] ||
    logger_levels[name] ||
    process.env["DL_ALL"] ||
    logger_levels["ALL"];
}

function getLogger(name) {
  let logger = log4js.getLogger(name);
  let log_level = getLoggerLevel(name);
  if (log_level) {
    logger.level = log_level;
    logger.info("Debug enabled for:", name);
  }
  return logger;
}

getLogger.log4js = log4js;

module.exports = getLogger;