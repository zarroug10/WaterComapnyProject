pipeline {
    agent any

    environment {
        NODEJS_HOME = tool name: 'NodeJS 14.17.0', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
        PATH = "${env.NODEJS_HOME}\\bin;${env.PATH}"
        CHROME_BIN = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        DOCKER_HUB_REGISTRY = 'docker.io'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                bat "${env.NODEJS_HOME}\\bin\\npm.cmd install --force"
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Build Docker image') {
            steps {
                script {
                    def imageName = "zarroug/dashboard:latest"
                    bat "docker build -t ${imageName} -f Dockerfile ."
                    bat "docker tag ${imageName} ${DOCKER_HUB_REGISTRY}/zarroug/dashboard:latest"
                }
            }
        }

        stage('Deploy Docker image') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'docker-hub-token', variable: 'DOCKER_TOKEN')]) {
                        docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-token') {
                            docker.image('zarroug/dashboard:latest').push('latest')
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
