# Settings specified here will take precedence over those in config/environment.rb

# The production environment is meant for finished, "live" apps.
# Code is not reloaded between requests
config.cache_classes = true

# Full error reports are disabled and caching is turned on
config.action_controller.consider_all_requests_local = false
config.action_controller.perform_caching             = true
config.action_view.cache_template_loading            = true

# See everything in the log (default is :info)
# config.log_level = :debug

# Use a different logger for distributed setups
# config.logger = SyslogLogger.new

# Use a different cache store in production
# config.cache_store = :mem_cache_store

# Enable serving of images, stylesheets, and javascripts from an asset server
# config.action_controller.asset_host = "http://assets.example.com"

# Raise an error if the mailer can't send an email
config.action_mailer.raise_delivery_errors = true

# Enable threaded mode
# config.threadsafe!

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
REGISTRY[:kt_url] =                   # Home URL for the app
REGISTRY[:allow_signups] = true       # Can users register? 
REGISTRY[:api_key] =                  # Google Earth API Key
REGISTRY[:data_dir] =                 # Path to a directory where the app can store user-generated content