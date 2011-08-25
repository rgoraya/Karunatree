set :application, "karunatree"
set :deploy_to, # Deployment path

# Git Configuration
default_run_options[:pty] = false # Must be set to true for Git's password prompt to work
set :scm, :git
set :repository, "git@github.com:dereklyons/Karunatree.git"
set :branch, "master"
set :deploy_via, :remote_cache
ssh_options[:forward_agent] = true


server #Server configuration

namespace :deploy do
    %w(start stop restart).each do |action|
        desc "#{action} the Thin processes"
        task action.to_sym do
          find_and_execute_task("thin:#{action}")
        end
    end
end

namespace :thin do
  %w(start stop restart).each do |action|
    desc "#{action} the app's Thin Cluster"
      task action.to_sym, :roles => :app do
        run "thin #{action} -c #{deploy_to}/current -C #{deploy_to}/current/config/thin.yml"
      end
  end
end

# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

#role :web, "your web-server here"                          # Your HTTP server, Apache/etc
#role :app, "your app-server here"                          # This may be the same as your `Web` server
#role :db,  "your primary db-server here", :primary => true # This is where Rails migrations will run
#role :db,  "your slave db-server here"

# If you are using Passenger mod_rails uncomment this:
# if you're still using the script/reapear helper you will need
# these http://github.com/rails/irs_process_scripts

# namespace :deploy do
#   task :start do ; end
#   task :stop do ; end
#   task :restart, :roles => :app, :except => { :no_release => true } do
#     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
#   end
# end