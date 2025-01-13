import {Test, TestingModule} from '@nestjs/testing';
import {SentimentAnalyzeController} from './sentiment-analyze.controller';
import {ClientProxy} from '@nestjs/microservices';
import {ReflexAILogger} from '../common/logger.service';
import {TextToAnalyzeDto} from './dto/textToAnalyze.dto';
import {RmqContext} from '@nestjs/microservices';
import {of, throwError} from 'rxjs';

describe('SentimentAnalyzeController', () => {
  let controller: SentimentAnalyzeController;
  let clientProxyMock: ClientProxy;
  let loggerMock: ReflexAILogger;

  beforeEach(async () => {
    // Mock ClientProxy
    clientProxyMock = {
      send: jest.fn(),
    } as unknown as ClientProxy;

    // Mock ReflexAILogger
    loggerMock = {
      verbose: jest.fn(),
      error: jest.fn(),
    } as unknown as ReflexAILogger;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SentimentAnalyzeController],
      providers: [
        {provide: 'SENTIMENT_ANALYZE_SERVICE', useValue: clientProxyMock},
        {provide: ReflexAILogger, useValue: loggerMock},
      ],
    }).compile();

    controller = module.get<SentimentAnalyzeController>(SentimentAnalyzeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('analyze', () => {
    let body: TextToAnalyzeDto;
    let context: RmqContext;

    beforeEach(() => {
      body = {
        person_id: '123',
        text: 'I love this product! It\'s amazing.',
      };

      // Mock RmqContext
      context = {} as RmqContext;
    });

    it('should return sentiment analysis result when successful', async () => {
      const result = {sentiment: 'positive', score: 0.95};
      jest.spyOn(clientProxyMock, 'send').mockReturnValue(of(result));

      const observable = await controller.analyze(body, context);
      const resolvedResult = await observable.toPromise();

      expect(resolvedResult).toEqual(result);
      expect(clientProxyMock.send).toHaveBeenCalledWith('sentiment_analyze', body);
      expect(loggerMock.verbose).toHaveBeenCalled();
    });

    it('should log error and rethrow if clientProxy fails', async () => {
      const error = new Error('Service unavailable');
      jest.spyOn(clientProxyMock, 'send').mockImplementation(() => {
        throw error;
      });

      await expect(controller.analyze(body, context)).rejects.toThrow(error);

      expect(clientProxyMock.send).toHaveBeenCalledWith('sentiment_analyze', body);
      expect(loggerMock.error).toHaveBeenCalledWith(expect.stringContaining('Error in analyzeSentiment: undefined'));
    });
  });
});
