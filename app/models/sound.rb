class Sound < ActiveRecord::Base
  def self.compress_to_json(name)
    return self.find_by_name(name).to_json()
  end
end
