class Tag < ActiveRecord::Base
  has_many :taggings, :dependent => :destroy
  has_many :seedlings, :through => :taggings
end
