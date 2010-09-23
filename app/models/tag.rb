#   Karunatree
#   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
#   
#   Author: Jason Lu

class Tag < ActiveRecord::Base
  has_many :taggings, :dependent => :destroy
  has_many :seedlings, :through => :taggings
end
