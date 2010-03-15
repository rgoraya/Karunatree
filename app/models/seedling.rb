class Seedling < ActiveRecord::Base
  has_attached_file :picture, :styles => {:large => "800x600>", :medium => "300x300>", :thumb => "100x100>" } #, :processors => [:tiff_formatter]
  
  belongs_to :user
  
  validates_attachment_size :picture, :less_than => 10.megabyte
end