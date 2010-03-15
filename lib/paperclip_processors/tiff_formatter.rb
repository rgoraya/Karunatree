require 'rubygems'
require 'mini_magick'

module Paperclip
  class TiffFormatter < Processor
    def initialize(file, options = {}, attachment = nil)
      @file = file
      @attachment = attachment
      @format = File.extname(@file.path)
    end
    
    def make
      if @format == ".tiff"
        # MiniMagick::Image.from_file(@file)
        puts "zomg"
        @file
      else
        puts "it not worky"
        new_image = MiniMagick::Image.from_file(@file.path)
        new_image.format "png"
        new_image.write @file.path
        new_image
      end
    end
  end
end