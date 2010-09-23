#   Karunatree
#   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
#   
#   Author: Derek Lyons

class RootController < ApplicationController
  
  def index
    # Render the landing page
  end

  def show
    render :action => params[:page]
  end
  
end
