node {
  stage 'prep'
  sh './build_scripts/prep.sh'

  stage 'lint'
  gulp lint

  stage 'test'
  gulp test

  stage 'build'
  sh './build_scripts/build.sh'

  stage 'deploy'
  sh 'echo not yet'
}
