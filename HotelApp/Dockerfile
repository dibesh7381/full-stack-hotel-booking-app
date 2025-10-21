# Stage 1: Build jar with Maven (Java 17)
FROM maven:3.9.2-openjdk-17 AS build
WORKDIR /app

# Copy pom and source
COPY pom.xml .
COPY src ./src

# Build jar
RUN mvn clean package -DskipTests

# Stage 2: Run jar with Java 17
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run app
ENTRYPOINT ["java", "-jar", "app.jar"]
