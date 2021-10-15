import winston from 'winston'
const { transports, format } = winston
const { timestamp, printf, combine,colorize } = format;

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new transports.Console(),
    ],
    format: combine(
        colorize(),
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A'
        }),
        printf(({ level, message, label, timestamp }) => `${timestamp} ${level}: ${message}`)
    )

})
export const parseError = e => e.stack || e
export default logger 