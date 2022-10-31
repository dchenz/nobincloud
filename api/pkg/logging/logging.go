package logging

import (
	"os"

	log "github.com/sirupsen/logrus"
)

func init() {
	log.SetFormatter(&log.TextFormatter{
		FullTimestamp: true,
	})
	// If no log file is set or file cannot be opened, write to stdout.
	if logPath, exists := os.LookupEnv("SERVER_LOG_FILE"); exists {
		fileMode := os.O_CREATE | os.O_APPEND | os.O_WRONLY
		if out, err := os.OpenFile(logPath, fileMode, 0600); err == nil {
			log.SetOutput(out)
		} else {
			log.Warnf("could not open '%s' for logging, defaulting to stdout", logPath)
		}
	}
}

func Log(format string, args ...interface{}) {
	log.Infof(format, args...)
}

func Warn(format string, args ...interface{}) {
	log.Warnf(format, args...)
}

func Error(format string, args ...interface{}) {
	log.Errorf(format, args...)
}
