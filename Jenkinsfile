pipeline {
    agent any

    environment {
        SERVICE_CREDS = credentials('stocks')
        DB_USER = "$SERVICE_CREDS_USR"
        DB_PASSWORD = "$SERVICE_CREDS_PSW"

        DOCKER_CREDS = credentials('docker')
        DOCKER_ID = "$DOCKER_CREDS_USR"
        DOCKER_PASS = "$DOCKER_CREDS_PSW"
    }

    options {
        timeout(time: 6, unit: "HOURS")
    }

    stages {
        stage('data') {
            steps {
                sh './data.sh'
            }
        }

        stage('build') {
            steps {
                sh './build.sh'
            }
        }
    }

    post {
        unsuccessful {
            notifyBuild()
        }
        fixed {
            notifyBuild()
        }
    }
}

// https://stackoverflow.com/questions/39140191/how-to-send-slack-notification-after-jenkins-pipeline-build-failed
// https://www.cloudbees.com/blog/sending-notifications-pipeline
def notifyBuild() {
    // build status of null means successful
    buildStatus = "${currentBuild.currentResult}"

    def summary = "${buildStatus}: ${env.JOB_NAME} - ${env.BUILD_DISPLAY_NAME} after ${currentBuild.durationString}"

    if (buildStatus == 'SUCCESS') {
        // GREEN
        colorCode = '#008000'
    } else {
        // RED
        colorCode = '#FF0000'
    }

    // Send notifications
    slackSend(color: colorCode, message: summary)
}
