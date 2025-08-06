pipeline {
    agent any

    stages {
        stage('Cloner le dépôt') {
            steps {
                git 'https://github.com/Mpacko/anon-ecommerce-website.git'
            }
        }

        stage('Déploiement sur vm-docker') {
            steps {
                sshagent (credentials: ['docker-remote']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no docker@192.168.234.136 '
                        cd /home/utilisateur &&
                        git clone https://github.com/Mpacko/anon-ecommerce-website.git || (cd anon-ecommerce-website && git pull) &&
                        cd anon-ecommerce-website &&
                        docker build -t anon-ecommerce-website . &&
                        docker rm -f anon-ecommerce-website || true &&
                        docker run -d --name anon-ecommerce-website -p 80:80 anon-ecommerce-website
                    '
                    '''
                }
            }
        }
    }
}
