
class Seedling < ActiveRecord::Base
  
  belongs_to :user
  
  has_friendly_id :title, :use_slug => true,
                          :approximate_ascii => true,
                          :max_length => 50
  
  has_attached_file :project, :styles => { :thumbnail => "100x100>", :small => "240x240>", :medium  => "500x500>", :large => "1024x1024>" },
                    :whiny_thumbnails => true,
                    :path => REGISTRY[:data_dir]+"/:class/:id-:seedling_slug/project/:id-:style.:extension",
                    :url => "/:class/:seedling_slug/project?style=:style"
                    
  has_attached_file :audio_message,
                    :path => REGISTRY[:data_dir]+"/:class/:id-:seedling_slug/:id-audio-message.:extension",
                    :url => "/:class/:seedling_slug/audio-message"
                      
  composed_of :location,
    :class_name => "Location",
    :mapping => 
      [  #  db    ruby
        %w[ lat   lat ],
        %w[ lon   lon ],
        %w[ alt   alt ]
      ]
      
      
  # Max and min lengths for all fields    
  TITLE_MIN_LENGTH = 1
  TITLE_MAX_LENGTH = 50
  TITLE_LENGTH_RANGE = TITLE_MIN_LENGTH..TITLE_MAX_LENGTH
  DESCRIPTION_MIN_LENGTH = 1
  DESCRIPTION_MAX_LENGTH = 500
  DESCRIPTION_LENGTH_RANGE = DESCRIPTION_MIN_LENGTH..DESCRIPTION_MAX_LENGTH

  
  #validations
  validates_length_of :title, :within => TITLE_LENGTH_RANGE
  validates_length_of :description, :within => DESCRIPTION_LENGTH_RANGE
  validates_numericality_of :lat,
                      :greater_than_or_equal_to => -180,
                      :less_than_or_equal_to => 180,
                      :message => "must be a number between -180 and 180."
  validates_numericality_of :lon,
                      :greater_than_or_equal_to => -180,
                      :less_than_or_equal_to => 180,
                      :message => "must be a number between -180 and 180."
  validates_numericality_of :alt,
                      :greater_than_or_equal_to => -1000,
                      :less_than_or_equal_to => 10000000,
                      :message => "must must be a number between -1000 and 10000000."
      
  # Text box sizes for display of views 
  USER_SIZE = 5   
  TITLE_SIZE = 20   
  DESCRIPTION_SIZE = 500
  LAT_SIZE = 11
  LON_SIZE = 11
  ALT_SIZE = 11
      
end