#   Karunatree
#   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
#   
#   Author: Derek Lyons

class CharactersController < ApplicationController
  
  # Todo: The :except should be removed before deploying the story system to a production server
  protect_from_forgery :except => [:add_to_inventory, :bind_behavior, :update]
  
  # Todo: This is a fairly inelegant approach to accomplishing this.
  def add_to_inventory
    @character = current_user.character
    locator = request.headers["locator"]
    if (@character.inventory.find_by_locator(locator))
      render :text => 'Feature <' + locator + '> is already in the inventory.'
    else
      @feature = Feature.find_by_locator(locator)
      @character.inventory << @feature
      @character.save
      render :text => 'Feature <' + locator +'> added.'
    end
  end
  
  def bind_behavior
    if (request.put?)
      @behavior = Behavior.find_by_locator(request.headers["behavior_locator"])
      @binding = BehaviorBinding.new
      @binding.locator = request.headers["feature_locator"]
      @binding.behavior = @behavior
      @binding.character = current_user.character
      @binding.save
      
      render :json => @behavior
    else
      render :text => "Can only bind behaviors with a PUT request."
    end
  end
  
  def index
    @characters = Character.all
  end
  
  def show
    @character = Character.find(params[:id])
  end
  
  def new
    @character = Character.new
  end
  
  def create
    @character = Character.new(params[:character])
    if @character.save
      flash[:notice] = "Successfully created character."
      redirect_to @character
    else
      render :action => 'new'
    end
  end
  
  def edit
    @character = Character.find(params[:id])
  end
  
  def update
    @character = Character.find(params[:id])
    if @character.update_attributes(params[:character])
      flash[:notice] = "Successfully updated character."
      redirect_to @character
    else
      render :action => 'edit'
    end
  end
  
  def destroy
    @character = Character.find(params[:id])
    @character.destroy
    flash[:notice] = "Successfully destroyed character."
    redirect_to characters_url
  end
  
end
