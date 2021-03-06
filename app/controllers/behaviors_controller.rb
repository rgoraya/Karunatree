#   Karunatree
#   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
#   
#   Author: Derek Lyons

class BehaviorsController < ApplicationController
  
  def index
    @behaviors = Behavior.all
  end
  
  def show
    @behavior = Behavior.find_by_locator(params[:id])
    
    respond_to do |format|
      format.html #show.html.haml
      format.json { render :json => @behavior }
    end
  end
  
  def new
    @behavior = Behavior.new
  end
  
  def create
    @behavior = Behavior.new(params[:behavior])
    if @behavior.save
      flash[:notice] = "Successfully created behavior."
      redirect_to @behavior
    else
      render :action => 'new'
    end
  end
  
  def edit
    @behavior = Behavior.find_by_locator(params[:id])
  end
  
  def update
    @behavior = Behavior.find_by_locator(params[:id])
    if @behavior.update_attributes(params[:behavior])
      flash[:notice] = "Successfully updated behavior."
      redirect_to @behavior
    else
      render :action => 'edit'
    end
  end
  
  def destroy
    @behavior = Behavior.find_by_locator(params[:id])
    @behavior.destroy
    flash[:notice] = "Successfully destroyed behavior."
    redirect_to behaviors_url
  end
  
end
