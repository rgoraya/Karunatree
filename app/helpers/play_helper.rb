#   Karunatree
#   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
#   
#   Author: Derek Lyons

module PlayHelper
  
  def story_nav_back
    if (@scene.has_back)
      button_to_remote "Back", :url => {:action => "back", :controller => "play"}
    end
  end
  
  def story_nav_next
    if (@scene.has_next)
      button_to_remote "Next", :url => {:action => "next", :controller => "play"}
    end
  end
  
  def nav_back_display
    if (@scene.has_back)
      return "display:inline"
    else
      return "display:none"
    end
  end
  
  def nav_next_display
    if (@scene.has_next)
      return "display:inline"
    else
      return "display:none"
    end
  end
  
  def fancy_title
    title = @scene.name.dup
    first_char = title.slice!(0).chr
    return '<img src="http://jhische.com/dailydropcap/' +
            first_char + '-' + @scene.dropcap.to_s +
            '-cap.png" title="Daily Drop Cap by Jessica Hische"' +
            ' alt="' + first_char + '" align="left"/>' + title
  end
    
end
