pipeline {
    agent any

    triggers {
        // Déclenche automatiquement le pipeline quand GitHub envoie un webhook
        githubPush()
    }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('Mpacko27')    // DockerHub credentials
        VPS_SSH_CREDENTIALS = credentials('vps-ssh-creds') // SSH credentials pour VPS
        DOCKER_IMAGE = "Mpacko27/app-web"                  // Repo DockerHub
        VPS_IP = "192.168.234.143"                         // IP VPS
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'master', url: 'https://github.com/Mpacko/Mercy_Innovation.git',
                credentialsId: 'github-token'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:latest ."
            }
        }

        stage('Login & Push Docker Image') {
            steps {
                sh """
                    echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                    docker push ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Deploy to VPS') {
            steps {
                sshagent(credentials: ['vps-ssh-creds']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no root@${VPS_IP} '
                            docker pull ${DOCKER_IMAGE}:latest &&
                            docker stop app-web || true &&
                            docker rm app-web || true &&
                            docker run -d --name app-web -p 8080:80 ${DOCKER_IMAGE}:latest
                        '
                    """
                }
            }
        }
    }

    post {
        success {
            mail to: "edingelemarc@gmail.com",
                 subject: "✅ Déploiement réussi : ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 mimeType: 'text/html',
                 body: """
                 <html>
                 <body style="font-family: Arial, sans-serif; color: #333;">
                     <h2 style="color: #2ECC71;">✅ Déploiement Réussi !</h2>
                     <p>Bonjour,</p>
                     <p>Le déploiement du projet <b>${env.JOB_NAME}</b> s'est terminé avec succès 🎉</p>
                     <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
                         <tr><td style="border: 1px solid #ddd; padding: 8px;"><b>Job</b></td><td style="border: 1px solid #ddd; padding: 8px;">${env.JOB_NAME}</td></tr>
                         <tr><td style="border: 1px solid #ddd; padding: 8px;"><b>Build</b></td><td style="border: 1px solid #ddd; padding: 8px;">#${env.BUILD_NUMBER}</td></tr>
                         <tr><td style="border: 1px solid #ddd; padding: 8px;"><b>URL</b></td><td style="border: 1px solid #ddd; padding: 8px;"><a href="${env.BUILD_URL}">${env.BUILD_URL}</a></td></tr>
                     </table>
                     <p style="margin-top: 15px;">Cordialement,<br><b>Jenkins CI/CD</b></p>
                 </body>
                 </html>
                 """
        }
        failure {
            script {
                // Récupère les 20 dernières lignes des logs pour l'email
                def logs = currentBuild.rawBuild.getLog(20).join("<br>")
                
                mail to: "edingelemarc@gmail.com",
                     subject: "❌ Échec du déploiement : ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                     mimeType: 'text/html',
                     body: """
                     <html>
                     <body style="font-family: Arial, sans-serif; color: #333;">
                         <h2 style="color: #E74C3C;">❌ Déploiement Échoué</h2>
                         <p>Bonjour,</p>
                         <p>Le déploiement du projet <b>${env.JOB_NAME}</b> a échoué. Voici un extrait des logs :</p>
                         <div style="background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; font-family: monospace; white-space: pre-wrap;">
                             ${logs}
                         </div>
                         <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
                             <tr><td style="border: 1px solid #ddd; padding: 8px;"><b>Job</b></td><td style="border: 1px solid #ddd; padding: 8px;">${env.JOB_NAME}</td></tr>
                             <tr><td style="border: 1px solid #ddd; padding: 8px;"><b>Build</b></td><td style="border: 1px solid #ddd; padding: 8px;">#${env.BUILD_NUMBER}</td></tr>
                             <tr><td style="border: 1px solid #ddd; padding: 8px;"><b>URL</b></td><td style="border: 1px solid #ddd; padding: 8px;"><a href="${env.BUILD_URL}">${env.BUILD_URL}</a></td></tr>
                         </table>
                         <p style="margin-top: 15px;">Merci de corriger les erreurs.<br><b>Jenkins CI/CD</b></p>
                     </body>
                     </html>
                     """
            }
        }
    }
}
