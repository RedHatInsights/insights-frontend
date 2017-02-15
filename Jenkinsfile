node('insights-frontend-slave') {

  stage('clone') {
    checkout scm
  }

  stage('get_scripts') {
    sh 'curl -qk https://gitlab.cee.redhat.com/FlipModeSquad/scripts/repository/archive.tar.bz2?ref=master > /tmp/scripts.tbz'
    sh 'tar xf /tmp/scripts.tbz -C /tmp'
    sh 'ln -s /tmp/scripts*/jenkins/insights-frontend ~/scripts'
  }

  stage('prep') {
    sh  'bash ~/scripts/scripts/prep.sh'
  }

  stage('lint') {
    sh 'gulp lint'
  }

  stage('test') {
    sh 'gulp test'
  }

  stage('build') {
    sh 'bash ~/scripts/scripts/build.sh'
  }

  if (env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'stable-4.6' || env.BRANCH_NAME == 'production-stable' || env.BRANCH_NAME == 'production-beta') {
    stage('deploy') {
      sh 'bash ~/scripts/scripts/deploy.sh'
    }
  }

}
