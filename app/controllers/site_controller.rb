class SiteController < ApplicationController
  def index
    @title = "Welcome to KarunaTree -- Environmental Literacy for Kids"
  end

  def about
    @title = "About KarunaTree"
  end

  def help
    @title = "KarunaTree Help"
  end

end
