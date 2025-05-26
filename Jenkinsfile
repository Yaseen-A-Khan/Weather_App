pipeline {
    agent any

    environment {
        APP_NAME = "${env.APP_NAME}"  // You can define APP_NAME in Jenkins or pass it at build time
    }

    stages {
        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Login to Docker') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat """
                    echo %%DOCKER_PASS%% | docker login -u %%DOCKER_USER%% --password-stdin
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat """
                    docker build -t %%DOCKER_USER%%/%APP_NAME%:v1.0 .
                    """
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat """
                    docker push %%DOCKER_USER%%/%APP_NAME%:v1.0
                    """
                }
            }
        }
    }
}
