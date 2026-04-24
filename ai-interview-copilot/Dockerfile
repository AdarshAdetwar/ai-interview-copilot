FROM maven:3.9.9-eclipse-temurin-17

WORKDIR /app

# copy only backend folder
COPY ai-interview-copilot ./ai-interview-copilot

# go inside backend
WORKDIR /app/ai-interview-copilot

# build project
RUN mvn clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/ai-interview-copilot-0.0.1-SNAPSHOT.jar"]