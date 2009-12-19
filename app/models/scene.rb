class Scene < ActiveRecord::Base
  STATIC_KTX_ROOT_PATH = 'http://localhost:3000/ktx/1-'
  KTX_EXTENSION = '.ktx.xml'
  
  def path_to_ktx
    return STATIC_KTX_ROOT_PATH + self.scene_number.to_s + KTX_EXTENSION
  end
  
end
