# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  
  before_filter :check_authorization
    
  protect_from_forgery # See ActionController::RequestForgeryProtection for details
  
  #Check for a valid authorization cookie, possibly logging the user in
  def check_authorization
    authorization_token = cookies[:authorization_token]
    if authorization_token and not logged_in?
      user = User.find_by_authorization_token(authorization_token)
      user.login!(session) if user
    end
  end

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password
end
