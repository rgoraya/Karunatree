require 'digest/sha1'
class User < ActiveRecord::Base
  # include all authlogic "features"
  acts_as_authentic
  before_create :create_character
  
  has_one :character
  has_many :seedlings
  
  #attr_accessor :remember_me, :password
  
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
  validates_uniqueness_of :login
  validates_length_of :login, :within => USERNAME_LENGTH_RANGE
  validates_format_of :login,
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
  
  def create_character
    self.character = Character.new(:scene_name => 'Dreams')
  end
end
