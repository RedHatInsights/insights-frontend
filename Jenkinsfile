node {

  stage('clone') {
    git 'git@github.com:ansible/insights-frontend.git'
    BRANCH = sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
    echo BRANCH
  }

  if (BRANCH == 'master' || BRANCH == 'stable-4.6' || BRANCH == 'production-stable' || BRANCH == 'production-beta') {
    stage('tmp') {
      echo 'FDSFSAFSFAFSA'
    }
  }

  // stage('get_scripts') {
  //   sh 'curl -qk https://gitlab.cee.redhat.com/FlipModeSquad/scripts/repository/archive.tar.bz2?ref=master > /tmp/scripts.tbz'
  //   sh 'tar xf /tmp/scripts.tbz -C /tmp'
  //   sh 'ln -s /tmp/scripts*/jenkins/insights-frontend ~/scripts'
  // }

  // stage('prep') {
  //   sh  'bash ~/scripts/scripts/prep.sh'
  // }

  // stage('lint') {
  //   sh 'gulp lint'
  // }

  // stage('test') {
  //   sh 'gulp test'
  // }

  // stage('build') {
  //   sh 'bash ~/scripts/scripts/build.sh'
  // }

  // if (BRANCH == 'master' || BRANCH == 'stable-4.6' || BRANCH == 'production-stable' || BRANCH == 'production-beta') {
  //   stage('deploy') {
  //     sh 'bash ~/scripts/scripts/deploy.sh'
  //   }
  // }
}
