pipeline {
    agent any

    environment {
        NODEJS_HOME = tool name: 'NodeJS', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
        PATH = "${env.NODEJS_HOME}/bin:${env.PATH}"
        CHROME_BIN = '/usr/bin/google-chrome' // Path to Chrome binary
        DOCKER_HUB_REGISTRY = 'docker.io' // Docker Hub registry URL
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
         stage('Build') {
            steps {
                sh 'npm build'
            }
        }

        stage('Install dependencies') {
          steps {
    sh '${NODEJS_HOME}/bin/npm install'
        }
            }
        stage('Build Docker image') {
            steps {
                sh 'docker build -t dashboard:latest -f Dockerfile .'
                // Tag the Docker image with a version
                sh 'docker tag dashboard:latest zarroug/dashboard:latest'
            }
        }

        stage('Deploy Docker image') {
            steps {
                script {
                    // Push Docker image to Docker Hub
                    withCredentials([string(credentialsId: 'token', variable: 'DOCKER_TOKEN')]) {
                        docker.withRegistry('https://index.docker.io/v1/', '12') {
                            // Push both the latest and tagged images
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
            // Add any success post-build actions here
        }

        failure {
            echo 'Build failed!'
            // Add any failure post-build actions here
        }
    }
}
