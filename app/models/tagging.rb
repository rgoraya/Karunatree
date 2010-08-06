class Tagging < ActiveRecord::Base
  belongs_to :seedling
  belongs_to :tag
  
  def self.get_seedling_ids()
    return self.seedling_id
  end
  
  
end
