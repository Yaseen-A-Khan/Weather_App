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

        stage('Decrypt .env File') {
            steps {
                withCredentials([string(credentialsId: 'ENV_DECRYPT_KEY', variable: 'DECRYPT_KEY')]) {
                    bat """
                    if exist .env (del .env)
                    openssl enc -aes-256-cbc -d -in .env.enc -out .env -pass pass:%DECRYPT_KEY%
                    """
                }
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
                    docker rmi %DOCKER_USER%/%APP_NAME%:v1.0 || exit 0
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

        stage('Run Docker Container') {
            steps {
                script {
                    bat """
                    docker stop react-container || exit 0
                    docker rm react-container || exit 0
                    docker run -d -p 3000:3000 --env-file .env --name react-container %DOCKER_USER%/%APP_NAME%:v1.0
                    """
                }
            }
        }
    }

    post {
        always {
            // Clean up decrypted env file for security
            bat "if exist .env (del .env)"
        }
    }
}
