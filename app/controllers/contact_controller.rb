#   Karunatree
#   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
#   
#   Author: Derek Lyons

class ContactController < ApplicationController
  
  def index
    #render index.html.haml
  end
  
  def seedlings
    #render seedlings.html.haml
  end
  
  def create
    if SpeedyDelivery.deliver_contact(params[:contact])
      flash[:notice] = "Thanks! Your email was successfully sent."
      redirect_to(contact_path)
    else
      flash.now[:error] = "Oops. An error occurred while trying to send your mail. Please try again."
      render :index
    end
  end
  
end
