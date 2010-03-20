class RootController < ApplicationController
  def index
    # Render the landing page
  end

  def show
    render :action => params[:page]
  end
end
