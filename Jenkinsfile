pipeline {
    agent any

    environment {
        DOCKER_USER   = "${env.DOCKER_USER}"      // Set in Jenkins -> Manage Jenkins -> Global properties
        DOCKER_PASS   = "${env.DOCKER_PASS}"      // Set in Jenkins -> Manage Jenkins -> Global properties
        APP_NAME      = "${env.APP_NAME}"         // Example: "weatherapp"
        ENV_PASSWORD  = "${env.ENV_PASSWORD}"     // Password used to decrypt .env.enc
    }

    stages {
        // stage('Checkout Source') {
        //     steps {
        //         checkout scm
        //     }
        // }

        // stage('Verify Kubernetes Setup') {
        //     steps {
        //         script {
        //             bat 'minikube status'
        //             bat 'kubectl get nodes'
        //             bat 'kubectl get pods -A'
        //         }
        //     }
        // }

        stage('Start Minikube') {
            steps {
                script {
                    bat '''minikube start --driver=docker'''
                }
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
                    kubectl delete secret weather-secret
                    kubectl create secret generic weather-secret --from-env-file=.env
                    '''
                }
            }
        }

        stage('Weather Secret'){
            steps{
                script{
                    bat '''kubectl get secret weather-secret -o yaml'''
                }
            }
        }


        stage('Delete previous deployment') {
            steps {
                script {
                    bat '''
                    kubectl delete deployment weather-app || exit 0
                    kubectl delete service weather-service || exit 0
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withEnv(["KUBECONFIG=C:\\Users\\yasee\\.kube\\config"]){
                    script {
                    bat '''
                    kubectl apply -f k8s/deployment.yaml
                    kubectl apply -f k8s/service.yaml
                    '''
                    }
                }
            }
        }

        // stage('Wait for Pod') {
        //     steps {
        //         script {
        //             bat 'kubectl wait --for=condition=ready pod -l app=weather-app --timeout=90s'
        //         }
        //     }
        // }


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
                    bat 'minikube service weather-service'
                }
            }
        }
    }
}
