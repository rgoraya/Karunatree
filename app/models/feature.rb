class Feature < ActiveRecord::Base
  has_one :behavior, :dependent => :nullify
  has_and_belongs_to_many :characters
  attr_accessible :locator, :name, :description
  
  # By overriding this method, we specify that when features are
  # converted to corresponding URLs, the locator attribute should
  # be used (rather than id)
  def to_param
    locator
  end
end
