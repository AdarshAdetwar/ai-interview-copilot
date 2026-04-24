FROM maven:3.9.9-eclipse-temurin-17

WORKDIR /app

COPY ai-interview-copilot ./ai-interview-copilot

WORKDIR /app/ai-interview-copilot

RUN mvn clean package -DskipTests

EXPOSE 8080

CMD ["sh", "-c", "java -jar target/ai-interview-copilot-0.0.1-SNAPSHOT.jar --server.port=$PORT"]