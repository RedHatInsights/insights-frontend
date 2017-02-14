node {
  stage('prep') {
    git 'git@github.com:ansible/insights-frontend.git'
    // git 'https://gitlab.cee.redhat.com/FlipModeSquad/scripts.git'
    sh 'echo $PWD'
    sh 'find /home/jenkins'
    sh './build_scripts/prep.sh'
  }

  stage('lint') {
    sh 'gulp lint'
  }

  stage('test') {
    sh 'gulp test'
  }

  stage('build') {
    sh './build_scripts/build.sh'
  }

  stage('deploy') {
    sh 'echo not yet'
  }
}
