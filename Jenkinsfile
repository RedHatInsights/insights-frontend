node {
  stage 'prep' {
    sh 'ls -lha .'
    sh './build_scripts/prep.sh'
  }

  stage 'lint' {
    sh 'gulp lint'
  }

  stage 'test' {
    sh 'gulp test'
  }

  stage 'build' {
    sh './build_scripts/build.sh'
  }

  stage 'deploy' {
    sh 'echo not yet'
  }
}
