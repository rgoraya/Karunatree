class PlayController < ApplicationController
  include ApplicationHelper
  
  # TODO! Fix this before deployment!!!
  protect_from_forgery :only => [:create, :update, :destroy]
  
  before_filter :protect
  
  def index
    @title = "Play KarunaTree"
    @user = User.get_current_user(session)
    @character = @user.character
    @scene = Scene.find_by_scene_number(@user.character.current_scene)
  end
  
  def earth_ready
    @character = User.get_current_user(session).character
    @scene = Scene.find_by_scene_number(@character.current_scene)
    render :update_view
  end
  
  def next
    @character = User.get_current_user(session).character
    @last_scene = Scene.find_by_scene_number(@character.current_scene)
    @character.current_scene += 1
    @scene = Scene.find_by_scene_number(@character.current_scene)
    @character.save
    render :update_view
  end
  
  def back
    @character = User.get_current_user(session).character
    @last_scene = Scene.find_by_scene_number(@character.current_scene)
    @character.current_scene -= 1
    @scene = Scene.find_by_scene_number(@character.current_scene)
    @character.save
    render :update_view
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
  
  private
  
  # Invoke from before_filter to keep non-logged-in users from seeing protected pages
  def protect
    unless logged_in?
      session[:protected_page] = request.request_uri
      flash[:notice] = "Please log in first."
      redirect_to :action => "login"
      return false
    end
  end

end
