#   Karunatree
#   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
#   
#   Author: Derek Lyons

load 'deploy' if respond_to?(:namespace) # cap2 differentiator
Dir['vendor/plugins/*/recipes/*.rb'].each { |plugin| load(plugin) }

load 'config/deploy' # remove this line to skip loading any of the default tasks

after "deploy:update_code", :link_config_files, :link_closure_library

task :link_config_files do
  run "for config_file in #{deploy_to}/#{shared_dir}/config/*; do ln -nfs $config_file #{release_path}/config/`basename $config_file`; done"
end

task :link_closure_library do
  run "rm #{release_path}/public/javascripts/closure/goog; ln -nfs #{deploy_to}/shared/closure/closure/goog #{release_path}/public/javascripts/closure/goog"
end