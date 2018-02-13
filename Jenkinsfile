node('insights-frontend-slave') {
  ansiColor('xterm') {
    stage('load_jenkinsfile') {
      sh 'curl -qLv https://$GITHUBTOKEN@github.com/RedHatInsights/insights-build/archive/master.zip > /tmp/master.zip'
      sh 'unzip /tmp/master.zip -d /tmp/'
      load '/tmp/insights-build-master/frontend/Jenkinsfile'
    }
  }
}
