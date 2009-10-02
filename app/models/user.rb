require 'digest/sha1'
class User < ActiveRecord::Base
  has_one :habitat
  has_one :kml_bundle
  
  attr_accessor :remember_me
  
  # Max and min lengths for all fields
  USERNAME_MIN_LENGTH = 3
  USERNAME_MAX_LENGTH = 20
  PASSWORD_MIN_LENGTH = 5
  PASSWORD_MAX_LENGTH = 20
  EMAIL_MAX_LENGTH = 50
  USERNAME_LENGTH_RANGE = USERNAME_MIN_LENGTH..USERNAME_MAX_LENGTH
  PASSWORD_LENGTH_RANGE = PASSWORD_MIN_LENGTH..PASSWORD_MAX_LENGTH
  
  # Text box sizes for display of views
  USERNAME_SIZE = 20
  PASSWORD_SIZE = 20
  EMAIL_SIZE = 30
  
  ## Model validation
  
  # Username
  validates_uniqueness_of :username
  validates_length_of :username, :within => USERNAME_LENGTH_RANGE
  validates_format_of :username,
                      :with => /^[A-Z0-9._-]*$/i,
                      :message => "may contain only letters, numbers, underscores, hyphens, and periods."
  # Email
  validates_uniqueness_of :email
  validates_length_of :email, :maximum => EMAIL_MAX_LENGTH              
  validates_format_of :email,
                      :with => /^[A-Z0-9._-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i,
                      :message => "must be a valid email address."
  
  # Password                    
  validates_length_of :password, :within => PASSWORD_LENGTH_RANGE
  
  # Log a user in
  def login!(session)
    session[:user_id] = self.id
  end
  
  # Log a user out
  def self.logout!(session, cookies)
    session[:user_id] = nil
    cookies.delete(:authorization_token)
  end
  
  # Return true if the user wants login status remembered
  def remember_me?
    remember_me =="1"
  end
  
  # Remember a user
  def remember!(cookies)
    cookie_expiration = 1.year.from_now
    cookies[:remember_me] = { :value  => "1",
                              :expires => cookie_expiration }
    self.authorization_token = unique_identifier
    self.save!
    cookies[:authorization_token] = { :value => self.authorization_token,
                                      :expires => cookie_expiration }
  end
  
  # Forget a user's login status
  def forget!(cookies)
    cookies.delete(:remember_me)
    cookies.delete(:authorization_token)
  end
  
  # Clear the password (typically to supress its display in a view)
  def clear_password
    self.password = nil
  end
  
  # Generate a unique identifier for a user
  def unique_identifier
    Digest::SHA1.hexdigest("#{self.username}:#{self.password}")
  end
  
  # Retrieve the User for the current session
  def self.get_current_user(session)
    @user = self.find_by_id(session[:user_id])
    logger.debug "Retrieving current user: #{@user.username}"
    return @user
  end
  
  # Check whether the current session's user has a habitat assigned
  def self.has_habitat?(session)
    @user = self.find_by_id(session[:user_id])
    if @user.habitat_id
      return true
    else
      return false
    end
  end
  
end
