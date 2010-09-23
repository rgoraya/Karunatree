#   Karunatree
#   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
#   
#   Author: Jason Lu

class Tagging < ActiveRecord::Base
  belongs_to :seedling
  belongs_to :tag
  
  def self.get_seedling_ids()
    return self.seedling_id
  end
  
  
end
