pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('Mpacko27')  // Nom du credential DockerHub
        VPS_SSH_CREDENTIALS = credentials('vps-ssh-creds')      // Nom du credential SSH VPS
        DOCKER_IMAGE = "Mpacko27/app-web"           // Ton repo DockerHub
        VPS_IP = "192.168.234.143"                           // IP ou domaine de ton VPS
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Mpacko/anon-ecommerce-website.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                        docker build -t ${DOCKER_IMAGE}:latest .
                    """
                }
            }
        }

        stage('Login to DockerHub & Push Image') {
            steps {
                script {
                    sh """
                        echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                        docker push ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }




        

        stage('Deploy to VPS') {
            steps {
                script {
                    sshagent(credentials: ['vps-ssh-creds']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no root@${VPS_IP} '
                                docker pull ${DOCKER_IMAGE}:latest &&
                                docker stop Anon-ecommerce-website || true &&
                                docker rm Anon-ecommerce-website || true &&
                                docker run -d --name Anon-ecommerce-website -p 8080:80 ${DOCKER_IMAGE}:latest
                            '
                         """
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Déploiement réussi !'
        }
        failure {
            echo '❌ Erreur lors du déploiement.'
        }
    }
}
