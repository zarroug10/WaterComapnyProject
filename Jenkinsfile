pipeline {
    agent any

    environment {
        NODEJS_HOME = tool name: 'NodeJS', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
        PATH = "${env.NODEJS_HOME}/bin:${env.PATH}"
        CHROME_BIN = '/usr/bin/google-chrome' // Ensure this path is correct
        DOCKER_HUB_REGISTRY = 'docker.io' // Docker Hub registry URL
    }

    stages {
        stage('Validate Tools') {
            steps {
                script {
                    // Print the versions to confirm the paths are correct
                    sh 'git --version'
                    sh '${NODEJS_HOME}/bin/node --version'
                    sh 'docker --version'
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install --force'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker image') {
            steps {
                script {
                    def imageName = "zarroug/dashboard:latest"
                    sh "docker build -t ${imageName} -f Dockerfile ."
                    sh "docker tag ${imageName} ${DOCKER_HUB_REGISTRY}/zarroug/dashboard:latest"
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
            // Add any success post-build actions here
        }
        failure {
            echo 'Build failed!'
            // Add any failure post-build actions here
        }
    }
}
