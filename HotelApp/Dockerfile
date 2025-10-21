# Stage 1: Build with Maven (Java 17)
FROM maven:3.8.1-openjdk-17-slim AS build
WORKDIR /app

# Copy pom and source code
COPY pom.xml .
COPY src ./src

# Build the project
RUN mvn clean package -DskipTests

# Stage 2: Run with Java 17
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
