import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class ReflexAILogger implements LoggerService {
    /**
     * Write a 'log' level log.
     */
    log(message: any, ...optionalParams: any[]) {
        console.log('LOG: ' + message);
        // Save the log to the database, DataDog, NewRelic, Prometheus/Grafana, etc
    }

    /**
     * Write a 'fatal' level log.
     */
    fatal(message: any, ...optionalParams: any[]) {
        console.error('FATAL: ' + message);
        // Save the log to the database, DataDog, NewRelic, Prometheus/Grafana, etc

    }

    /**
     * Write an 'error' level log.
     */
    error(message: any, ...optionalParams: any[]) {
        console.error('ERROR: ' + message);
        // Save the log to the database, DataDog, NewRelic, Prometheus/Grafana, etc
    }

    /**
     * Write a 'warn' level log.
     */
    warn(message: any, ...optionalParams: any[]) {
        console.warn('WARN: ' + message);
        // Save the log to the database, DataDog, NewRelic, Prometheus/Grafana, etc
    }

    /**
     * Write a 'debug' level log.
     */
    debug?(message: any, ...optionalParams: any[]) {
        console.debug('DEBUG: ' + message);
        // Save the log to the database, DataDog, NewRelic, Prometheus/Grafana, etc
    }

    /**
     * Write a 'verbose' level log.
     */
    verbose?(message: any, ...optionalParams: any[]) {
        console.info('VERBOSE: ' + message);
        // Save the log to the database, DataDog, NewRelic, Prometheus/Grafana, etc

    }
}