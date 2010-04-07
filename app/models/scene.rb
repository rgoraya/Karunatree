class Scene < ActiveRecord::Base
  
  # Constants
  KML_ROOT_PATH = REGISTRY[:kt_url] + '/kml/'
  KTX_EXTENSION = '.xml'
  
  FIRST_SCENE = 'Dreams'
  
  
  def path_to_kml
    filename = self.name.downcase
    if (self.subscene != 0)
      filename = filename + '-' + self.subscene.to_s
    end
    return KML_ROOT_PATH + filename + KTX_EXTENSION
  end
      
  def full_name
    return self.name + "-" + self.subscene.to_s
  end
    
  
  def has_back
    if (self.prev_scene_name) 
      return true;
    else
      return false;
    end
  end
  
  def has_next
    if (self.next_scene_name)
      return true;
    else 
      return false;
    end
  end
  
  def has_soundtrack
    if (self.soundtrack != "<>")
      return true;
    else
      return false;
    end
  end
  
  def has_ambient_sound
    if (self.ambient_sound != "<>")
      return true;
    else
      return false;
    end
  end
  
  def has_sound
    return (self.has_soundtrack || self.has_ambient_sound)
  end
  
end
