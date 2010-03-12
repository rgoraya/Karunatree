class PlayController < ApplicationController
  include ApplicationHelper
  
  # TODO! Fix this before deployment!!!
  # This is to get the save method to work
  protect_from_forgery :only => [:create, :update, :destroy]
  
  before_filter :protect
  
  def index
    @title = "Play KarunaTree"
    @user = User.get_current_user(session)
    @character = @user.character
    @scene = Scene.find_by_name_and_subscene(@user.character.scene_name, @user.character.subscene)
  end
  
  #def earth_ready
  #  @character = User.get_current_user(session).character
  #  @scene = Scene.find_by_scene_number(@character.current_scene)
  #  render :update_view
  #end
  
  # Should be moved to a Scene controller
  def next
    @character = User.get_current_user(session).character    
    @last_scene = Scene.find_by_name_and_subscene(@character.scene_name, @character.subscene)
    @scene = Scene.find_by_name_and_subscene(@last_scene.next_scene_name, @last_scene.next_subscene)
    @character.scene_name = @scene.name
    @character.subscene = @scene.subscene
    @character.save
    render :update_view
  end
  
  # Should be moved to a Scene controller
  def back
    @character = User.get_current_user(session).character
    @last_scene = Scene.find_by_name_and_subscene(@character.scene_name, @character.subscene)
    @scene = Scene.find_by_name_and_subscene(@last_scene.prev_scene_name, @last_scene.prev_subscene)
    @character.scene_name = @scene.name
    @character.subscene = @scene.subscene
    @character.save
    render :update_view
  end
  
  # Should be moved to a Scene controller
  def request_scene
    debugger
    if (request.put?)
      scene_name = request.headers["scene"]
      subscene = request.headers["subscene"]
      Rails.logger.info("Processing request for: Scene <" + scene_name + ">, Subscene <" + subscene + ">")
      
      @character = User.get_current_user(session).character
      @last_scene = Scene.find_by_name_and_subscene(@character.scene_name, @character.subscene)
      @scene = Scene.find_by_name_and_subscene(scene_name, subscene)
      @character.scene_name = scene_name
      @character.subscene = subscene
      @character.save
      render :update_view      
    else
      render :text => "Can't request scenes using GET."
    end
  end
  
  # TODO First pass at serializing KML state back to the database. Eventually
  # this should probably live in a separate controller
  def save
    if (request.post?)
      @character = User.get_current_user(session).character
      @character.saved_kml = params[:kml]
      @character.save
      render :text => "Updated character with KML: " + params[:kml]
    else
      render :text => "You must be lost. This page should not be accessed directly."
    end
  end
  
  def test
    render :text => "And so our story continues, for the feature " + params[:obj]
  end
  
  private
  
  # Invoke from before_filter to keep non-logged-in users from seeing protected pages
  def protect
    unless logged_in?
      session[:protected_page] = request.request_uri
      flash[:notice] = "Please log in first."
      redirect_to :action => "login", :controller => "user"
      return false
    end
  end

end
