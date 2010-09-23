#   Karunatree
#   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
#   
#   Author: Derek Lyons

class Character < ActiveRecord::Base
  belongs_to :user
  has_many :behavior_bindings, :dependent => :destroy
  has_and_belongs_to_many :inventory, :class_name => "Feature"
end
