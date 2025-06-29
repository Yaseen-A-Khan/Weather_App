pipeline {
    agent any

    environment {
        DOCKER_USER = "${env.DOCKER_USER}"
        DOCKER_PASS = "${env.DOCKER_PASS}"
        APP_NAME = "${env.APP_NAME}"
        ENV_PASSWORD = "${env.ENV_PASSWORD}"
    }

    stages {
        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Decrypt .env') {
            steps {
                script {
                    bat '''
                    if exist .env (del .env)
                    openssl enc -aes-256-cbc -d -in .env.enc -out .env -pass pass:%ENV_PASSWORD%
                    '''
                }
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
                }
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    bat '''
                    docker rmi %DOCKER_USER%/%APP_NAME%:v1.0 || exit 0
                    docker build -t %DOCKER_USER%/%APP_NAME%:v1.0 .
                    docker push %DOCKER_USER%/%APP_NAME%:v1.0
                    '''
                }
            }
        }

        stage('Update Kubernetes Secret') {
            steps {
                script {
                    bat '''
                    kubectl delete secret weather-secret || exit 0
                    kubectl create secret generic weather-secret --from-env-file=.env
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    bat '''
                    kubectl apply -f k8s/deployment.yaml
                    kubectl apply -f k8s/service.yaml
                    '''
                }
            }
        }

        stage('Confirm App Running') {
            steps {
                script {
                    bat 'kubectl get pods'
                    bat 'kubectl get service weather-service'
                }
            }
        }

        stage('Open App URL') {
            steps {
                script {
                    bat 'minikube service weather-service --url'
                }
            }
        }
    }
}
