pipeline {
    agent any

    environment {
        DOCKER_USER = "${env.DOCKER_USER}"
        DOCKER_PASS = "${env.DOCKER_PASS}"
        APP_NAME = "${env.APP_NAME}"
    }

    stages {
        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Login to Docker') {
            steps {
                script {
                    // Login to Docker Hub
                    sh """
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                    docker build -t $DOCKER_USER/$APP_NAME:v1.0 .
                    """
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    sh """
                    docker push $DOCKER_USER/$APP_NAME:v1.0
                    """
                }
            }
        }
    }
}
