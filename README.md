# ReflexAI - Sentiment Analyzer

## Technology used to develop this project:
- I used NestJS with Fastify in API-Gateway to improve performance.
- I used NestJS microservices to scale and optimize when we needed it.
- To validate API I used **_class-validator_** and **_class-transformer_** packages, more info here: https://docs.nestjs.com/techniques/validation
- Swagger to document the API, more info here: https://docs.nestjs.com/openapi/introduction, the URL is http://localhost:8090/api
- I created a module called **SentimentAnalyzeModule** in both microservices to implement the sentiment analysis functionality. Then, we can create more modules to address several other functionalities.
- To connect microservices, I used RabbitMQ because it is a fast and reliable message broker.
- To store data, I used MongoDB version 7.
- Google Cloud Platform was used to access Natural Language API.


## How to run the project:
- Ensure the .env file in the **_reflexai-infraestructure_** folder was filled with the correct values. Also, be sure the variable GOOGLE_APPLICATION_CREDENTIALS_LOCAL points to your Google key JSON file.
- Ensure you have the Google Cloud service account credentials file (JSON) with the appropriate permissions (e.g., language.googleapis.com API access) in the folder of your election, for example: "/keys/google-key.json." Please **_NEVER upload your JSON file to GitHub_**.
  GOOGLE_APPLICATION_CREDENTIALS="../reflexai-infraestructure/google-key.json" or pointing to the folder and file you choose
- Run the following command: `docker compose -f docker-compose.yaml up -d --build`
- Use http://localhost:8090/api/v1/sentiment-analyze to test the service using this payload with a POST method body:
  `{ 
      "person_id": "123",
      "text": "I need help with my life. I feel sad today, very sad." 
  }`
- If you omit person_id, it will be considered "anonymous".
- I used the POST method instead of the GET because it is more secure and allows me to send more text without the GET method's character length limitations.
- To test the service, you can use the Postman Json collection provided in this repository, located in the root folder and named **_ReflexAI-Challenge.postman_collection.json_**.
- Also, you can run the API with Swagger at http://localhost:8080/api URL.

## To run tests:
- Run: `npm run test` inside **_reflexai-apigateway-microservice_** folder.

## Other considerations:
- It was tested to run in macOS Sequoia with an Apple M3 ARM CPU and Ubuntu 24.04 x86_64 to ensure it would also work with an AMD64 CPU.
- I used a person_id to identify the user but did not save the name or last name, assuming the user is anonymous, to protect the person's identity and privacy.
- If I had more time, I would implement the design pattern configuration and Jenkins pipeline. You can open the Jenkins file in the repository root to see the steps I will take.
- The total time it took to develop this challenge was two and a half hours, maybe almost three hours, because I used small slots of time this past weekend and on Monday to develop these fun challenges.