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
                    bat """
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    bat """
                    docker build -t %DOCKER_USER%/%APP_NAME%:v1.0 .
                    """
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    bat """
                    docker push %DOCKER_USER%/%APP_NAME%:v1.0
                    """
                }
            }
        }
    }
}
