# Stage 1: Build with Maven (Java 17)
FROM openjdk:17-jdk-slim AS build

# Install Maven 3.9.2
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://dlcdn.apache.org/maven/maven-3/3.9.2/binaries/apache-maven-3.9.2-bin.tar.gz && \
    tar -xvzf apache-maven-3.9.2-bin.tar.gz && \
    mv apache-maven-3.9.2 /opt/maven

# Set Maven environment variables
ENV MAVEN_HOME=/opt/maven
ENV PATH=$MAVEN_HOME/bin:$PATH

# Set working directory
WORKDIR /app

# Copy project files
COPY pom.xml .
COPY src ./src

# Build the project
RUN mvn clean package -DskipTests

# Stage 2: Run with Java 17
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
