class Scene < ActiveRecord::Base
  STATIC_KTX_ROOT_PATH = 'http://localhost:3000/ktx/1-'
  KTX_EXTENSION = '.ktx.xml'
  
  FINAL_SCENE_NUMBER = 8
  
  def path_to_ktx
    return STATIC_KTX_ROOT_PATH + self.scene_number.to_s + KTX_EXTENSION
  end
  
  def has_back
    if (self.scene_number > 1) 
      return true;
    else
      return false;
    end
  end
  
  def has_next
    if (self.scene_number < FINAL_SCENE_NUMBER) 
      return true;
    else 
      return false;
    end
  end
  
  def has_soundtrack
    if (self.soundtrack)
      return true;
    else
      return false;
    end
  end
  
  def has_ambient_sound
    if (self.ambient_sound)
      return true;
    else
      return false;
    end
  end
  
  def has_sound
    return (self.has_soundtrack || self.has_ambient_sound)
  end
  
end
