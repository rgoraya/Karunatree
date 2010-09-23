#   Karunatree
#   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
#   
#   Author: Derek Lyons

# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  
  def nav_link(text, controller, action="index")
    link_to_unless_current text,  :controller => controller,
                                  :action => action
  end
  
  # Return true if some user is logged in
  def logged_in?
    not session[:user_id].nil?
  end
  
end
