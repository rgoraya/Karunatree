require 'rubygems'
require 'mini_magick'

class Seedling < ActiveRecord::Base
  has_attached_file :picture, :styles => {:large => "800x600>", :medium => "300x300>", :thumb => "100x100>" }#, :processors => [:tiff_formatter]
  before_post_process :convert_tiff_to_png
  
  belongs_to :user
  
  validates_attachment_size :picture, :less_than => 10.megabyte
  
  def convert_tiff_to_png
    new_image = MiniMagick::Image.from_file(@file.path)
  end
end