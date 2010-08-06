class Comment < ActiveRecord::Base
  belongs_to :seedling
  
  #validations
  validates_length_of :author, :within => 1..20
  validates_length_of :body, :within => 1..500
end
