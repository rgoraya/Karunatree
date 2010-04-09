class PlayController < ApplicationController
  include ApplicationHelper
  
  # TODO! Fix this before deployment!!!
  # This is to get the save method to work
  protect_from_forgery :only => [:create, :update, :destroy]
  
  before_filter :require_user
  
  def index
    @title = "Play KarunaTree"
    @user = current_user
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
    @character = current_user.character    
    @last_scene = Scene.find_by_name_and_subscene(@character.scene_name, @character.subscene)
    @scene = Scene.find_by_name_and_subscene(@last_scene.next_scene_name, @last_scene.next_subscene)
    @character.scene_name = @scene.name
    @character.subscene = @scene.subscene
    @character.save
    render :update_view
  end
  
  # Should be moved to a Scene controller
  def back
    @character = current_user.character
    @last_scene = Scene.find_by_name_and_subscene(@character.scene_name, @character.subscene)
    @scene = Scene.find_by_name_and_subscene(@last_scene.prev_scene_name, @last_scene.prev_subscene)
    @character.scene_name = @scene.name
    @character.subscene = @scene.subscene
    @character.save
    render :update_view
  end
  
  # Should be moved to a Scene controller
  def request_scene
    if (request.put?)
      scene_name = request.headers["scene"]
      subscene = request.headers["subscene"]
      Rails.logger.info("Processing request for: Scene <" + scene_name + ">, Subscene <" + subscene + ">")
      
      @character = current_user.character
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
      @character = current_user.character
      @character.saved_kml = params[:kml]
      @character.save
      render :text => "Updated character with KML: " + params[:kml]
    else
      render :text => "You must be lost. This page should not be accessed directly."
    end
  end
  
  # Debugging action. Used to return the character to the start of the chapter.
  def restart
    @character = current_user.character
    @last_scene = Scene.find_by_name_and_subscene(@character.scene_name, @character.subscene)
    @scene = Scene.find_by_name_and_subscene('Dreams', 0)
    @character.scene_name = @scene.name
    @character.subscene = @scene.subscene
    @character.save
    render :update_view
  end
  
  def test
    render :text => "And so our story continues, for the feature " + params[:obj]
  end

end
