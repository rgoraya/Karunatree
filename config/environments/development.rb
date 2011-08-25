# Settings specified here will take precedence over those in config/environment.rb

# In the development environment your application's code is reloaded on
# every request.  This slows down response time but is perfect for development
# since you don't have to restart the webserver when you make code changes.
config.cache_classes = false

# Log error messages when you accidentally call methods on nil.
config.whiny_nils = true

# Show full error reports and disable caching
config.action_controller.consider_all_requests_local = true
config.action_view.debug_rjs                         = true
config.action_controller.perform_caching             = false

# Raise an error if the mailer can't send
config.action_mailer.raise_delivery_errors = true

# Configure the mailer
config.action_mailer.delivery_method = :smtp
config.action_mailer.smtp_settings = {
  :address => ,
  :port => ,
  :enable_starttls_auto => ,
  :domain => ,
  :authentication => ,
  :user_name => ,
  :password => 
}

# KarunaTree constants
REGISTRY[:version] = "0.9 (Sequoia)"
REGISTRY[:kt_url] = "http://localhost:3000"
REGISTRY[:allow_signups] = true
REGISTRY[:api_key] =                            # Google Earth API key for localhost
REGISTRY[:data_dir] = RAILS_ROOT+"/public/data" # Path to a directory where the app can store user-generated content