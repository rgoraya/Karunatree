class PlayController < ApplicationController
  include ApplicationHelper
  
  before_filter :protect
  
  def index
    @title = "Play KarunaTree"
    @user = User.get_current_user(session)
    @scene = Scene.find_by_scene_number(@user.character.current_scene)
  end
  
  def next
    @character = User.get_current_user(session).character
    @character.current_scene += 1
    @scene = Scene.find_by_scene_number(@character.current_scene)
    @character.save
    render :update_view
  end
  
  def back
    @character = User.get_current_user(session).character
    @character.current_scene -= 1
    @scene = Scene.find_by_scene_number(@character.current_scene)
    @character.save
    render :update_view
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
