server 'admin-preview.goodcity.hk:59207', user: 'deployer', roles: %w{web}
set :branch, 'preview'
set :deploy_to, '/var/www/html/admin-preview.goodcity.hk'
