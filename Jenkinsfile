pipeline {
    agent any

    environment {
        DOCKER_USER   = "${env.DOCKER_USER}"      // Set in Jenkins -> Manage Jenkins -> Global properties
        DOCKER_PASS   = "${env.DOCKER_PASS}"      // Set in Jenkins -> Manage Jenkins -> Global properties
        APP_NAME      = "${env.APP_NAME}"         // Example: "weatherapp"
        ENV_PASSWORD  = "${env.ENV_PASSWORD}"     // Password used to decrypt .env.enc
    }

    stages {
        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        // stage('Verify Kubernetes Setup') {
        //     steps {
        //         script {
        //             bat 'minikube status'
        //             bat 'kubectl get nodes'
        //             bat 'kubectl get pods -A'
        //         }
        //     }
        // }


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

        stage('Verify Deployment') {
            steps {
                script {
                    bat 'kubectl get pods'
                    bat 'kubectl get service weather-service'
                }
            }
        }

        stage('Expose App URL') {
            steps {
                script {
                    bat 'minikube service weather-service --url'
                }
            }
        }
    }
}
