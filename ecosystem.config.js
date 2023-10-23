module.exports = {
  apps: [
    {
      name: 'Recruitment',
      exec_mode: 'cluster',
      instances: '2', // Or a number of instances
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env_local: {
        APP_ENV: 'local',
        PORT: '8012' // APP_ENV=local
      },
      env_development: {
        APP_ENV: 'dev',
        PORT: '3000' // APP_ENV=dev
      },
      env_production: {
        APP_ENV: 'prod',
        PORT: '80' // APP_ENV=prod
      }
    }
  ]
}