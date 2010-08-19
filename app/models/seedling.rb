
class Seedling < ActiveRecord::Base
  
  has_and_belongs_to_many :users
  has_many :comments, :dependent => :destroy
  has_many :taggings, :dependent => :destroy
  has_many :tags, :through => :taggings
  attr_accessor :tag_names
  after_save :assign_tags
  
  accepts_nested_attributes_for :tags, :allow_destroy => :true ,  :reject_if => proc { |attrs| attrs.all? { |k, v| v.blank? } } 
  
  has_friendly_id :title, :use_slug => true,
                          :approximate_ascii => true,
                          :max_length => 50
  
  has_attached_file :project, :styles => { :square => "80x80#", :thumbnail => "100x100>", :small => "240x240>", :medium  => "500x500>", :large => "1024x1024>" },
                    :whiny_thumbnails => true,
                    :path => REGISTRY[:data_dir]+"/:class/:id-:seedling_slug/project/:id-:style.:extension",
                    :url => "/:class/:seedling_slug/project?style=:style"
                    
  has_attached_file :audio_message,
                    :path => ":rails_root/public/system/:class/:id-:seedling_slug/:id-audio-message.:extension",
                    :url => "/system/:class/:id-:seedling_slug/:id-audio-message.:extension"
                    #:url => "/:class/:seedling_slug/audio_message"
                      
  composed_of :location,
    :class_name => "Location",
    :mapping => 
      [  #  db    ruby
        %w[ lat   lat ],
        %w[ lon   lon ],
        %w[ alt   alt ]
      ]
      
  # Uncomment this function to update Seedlings using a rake task,
  # e.g. rake paperclip:refresh
  #
  #def readonly?
  #  return false
  #end
  
  def linked_usernames
    linked_usernames = Array.new
    self.users.each do |user|
      linked_usernames.push()
    end
  end
  
  def has_uncredited_authors
    if(!self.uncredited_authors.blank?)
      if(self.uncredited_authors > 0)
        return true
      else
        return false
      end
    end
  end
  
  def total_authors
    number_uncredited_authors = self.has_uncredited_authors ? self.uncredited_authors : 0
    return self.users.count + number_uncredited_authors
  end

  def self.get_tags(seedlings)
    seedTags = Array.new
    seedlings.each do |seedling|
      for tag in seedling.tags
        seedTags.push(tag.name)
      end
      #seedTags.push(seedling.tag_names)
    end
    return seedTags
  end
      
  def self.get_friendly_ids(seedlings)
    friendly_ids = Array.new
    seedlings.each do |seedling|
      friendly_ids.push(seedling.friendly_id)
    end
    return friendly_ids
  end

  def self.get_image_url(seedlings)
    urls = Array.new
    seedlings.each do |seedling|
      urls.push(seedling.project.url(:thumbnail))
    end
    return urls
  end
  
  def self.get_tag_image_url(seedlings)
    urls = Array.new
    seedlings.each do |seedling|
      urls.insert(seedling.id, seedling.project.url(:thumbnail))
    end
    return urls
  end

  
  def like
    self.like += 1
    self.save
  end

  def tag_names
    @tag_names || tags.map(&:name).join(' ')
  end
  
  private
  
  def assign_tags
    if @tag_names
      self.tags = @tag_names.split(/\s+/).map do |name|
        Tag.find_or_create_by_name(name)
      end
    end
  end
      
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