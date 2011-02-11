#   Karunatree
#   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
#   
#   Author: Derek Lyons & Mike Chai

require 'digest/sha1'
class User < ActiveRecord::Base
  
  # include all authlogic "features"
  acts_as_authentic
  
  before_create :create_character
  
  has_one :character
  has_and_belongs_to_many :seedlings
  
  has_attached_file :avatar, :styles => { :square => "80x80#", :thumbnail => "100x100>", :small => "240x240>", :medium  => "500x500>", :large => "1024x1024>" },
                    :whiny_thumbnails => true,
                    :path => REGISTRY[:data_dir]+"/:class/:username/avatar/:id-:style.:extension",
                    :url => "/:class/:username/avatar?style=:style",
                    :default_url => "/images/system/default-avatar/default-:style.jpg"

  has_many :likes
  def already_likes?(current_user, seedling_id)
    :likes.find(:first, :conditions => ['user_id = ? AND seedling_id = ?', current_user, seedling_id] ).nil?
  end
  
  # By overriding this method, we specify that when behaviors are
  # converted to corresponding URLs, the locator attribute should
  # be used (rather than id)
  def to_param
    username
  end
  
  def self.get_user_seedlings(user)
    return user.seedlings
  end
    
  
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
  
  # Login
  validates_uniqueness_of :username
  validates_length_of :username, :within => USERNAME_LENGTH_RANGE
  validates_format_of :username,
                      :with => /^[A-Z0-9_-]*$/i,
                      :message => "may contain only letters, numbers, underscores, and hyphens."
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
