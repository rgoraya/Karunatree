require 'rubygems'
require 'mini_magick'

module Paperclip
  class TiffFormatter < Paperclip::Processor
    def initialize(file, options = {}, attachment = nil)
      super
      @file = file
      @attachment = attachment
      @instance = options[:instance]
      @format = File.extname(@file.path)
      @current_format   = File.extname(@file.path)
      @basename         = File.basename(@file.path, @current_format)
    end
    
    def make      
      @file.pos = 0 # Reset the file position incase it is coming out of a another processor
      dst = Tempfile.new([@basename, @format].compact.join("."))
      new_image = MiniMagick::Image.from_file(@file.path)
      if @format == ".tiff" || @format == ".tif"
        new_image.format 'tiff', '*.png'
      end
      dst << new_image
      dst
    end
  end
end