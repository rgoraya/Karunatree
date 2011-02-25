#   Karunatree
#   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
#   
#   Authors: Derek Lyons, Raminder Goraya, & Jason Lu

class SeedlingsController < ApplicationController
  before_filter :require_user, :only => [:new]
  auto_complete_for :seedling, :title
  auto_complete_for :tag, :name
  
  def index
    
    user_agent = request.env['HTTP_USER_AGENT'].downcase 
     if user_agent =~ /msie/i 
        "Internet Explorer" 
        redirect_to :controller=>"root"
        flash[:notice] = "Oops! Your browser is not supported. Please use Safari, Google Chrome or Mozilla Firefox to access the website."
     else
        @seedlings = Seedling.find(:all)
        @taggings = Tagging.find(:all)
        @tags = Tag.find(:all)
        respond_to do |format|
          format.html {}
          format.xml{
            render :text=>@seedling.to_xml(:only=>[:title, :lat,:lon,:description], :root=>"name")
          }
          format.json{
            render :text=>@seedling.to_json
          }
      end
    end
    
  end
  
  def show
    @seedling = Seedling.find(params[:id], :readonly => false)
    respond_to do |format|
      format.html {}
      format.xml{
        render :text=>@seedling.to_xml(:only=>[:title, :lat,:lon,:description], :root=>"name")
      }
      format.json{
        render :text=>@seedling.to_json
      }
    end
    
    # The following code checks for the unique page view Cookie. If not found, the database
    # field "Views" is incremented and a cookie (expires after 1year) is set in the browser

    cookie_viewed = "viewed" + @seedling.id.to_s()
    if cookies[cookie_viewed] # => @seedling.id
    else
      @seedling.increment!(:views)
      cookies[cookie_viewed] = {:value => @seedling.id, :expires => 1.year.from_now}
    end
  
  end

 
  def like
    @seedling = Seedling.find(params[:id], :readonly => false)
    cookie_liked = "liked" + @seedling.id.to_s()
    if cookies[cookie_liked] # => @seedling.id
    else  
      cookies[cookie_liked] = {:value => @seedling.id, :expires => 1.year.from_now}
      @seedling.increment!(:likes)      
      render :partial => 'boosts'
    end
  end

  def unlike
    @seedling = Seedling.find(params[:id], :readonly => false)
    cookie_liked = "liked" + @seedling.id.to_s()
    if cookies[cookie_liked] # => @seedling.id
      cookies.delete cookie_liked  
      @seedling.decrement!(:likes)      
      render :partial => 'boosts'
    end
  end

  
  def new
  	@seedling = Seedling.new
  end

  def create
    @seedling = Seedling.new(params[:seedling])
    if @seedling.save      
      # retrieve the URL of this newly created seedling
      long_url = url_for(@seedling).to_s()
      
      # make bit.ly API call to get shortened URL
      short_url = shorten_with_bitly(long_url) 
      
      # save the shortened URL in the DB
      @seedling.update_attribute(:short_url, short_url)
      
      flash[:notice] = "Successfully created seedling."
      redirect_to @seedling
      
    else

      render :action => 'new'
    end
  end
  
  def edit
    @seedling = Seedling.find(params[:id])
  end
  
  def update
    @seedling = Seedling.find(params[:id], :readonly => false)
    if @seedling.update_attributes(params[:seedling])
      flash[:notice] = "Successfully updated seedling."
      redirect_to @seedling
    else
      render :action => 'edit'
    end
  end
  
  def comment
    Seedling.find(params[:id]).comments.create(params[:comment])
    flash[:notice] = "Added your comment"
    redirect_to :action => "show", :id => params[:id]
  end
  
  def destroy
    @seedling = Seedling.find(params[:id])
    @seedling.destroy
    flash[:notice] = "Successfully destroyed seedling."
    redirect_to seedlings_url
  end

  def project
    @seedling = Seedling.find(params[:id])
    style = params[:style] ? params[:style] : 'original'
    if @seedling.project_content_type == "image/png"
      send_file REGISTRY[:data_dir]+"/seedlings/"+@seedling.id.to_s()+'-'+@seedling.friendly_id+'/project/'+@seedling.id.to_s()+'-'+style+".png", :disposition => 'inline'
    elsif @seedling.project_content_type == "image/jpeg"
      send_file REGISTRY[:data_dir]+"/seedlings/"+@seedling.id.to_s()+'-'+@seedling.friendly_id+'/project/'+@seedling.id.to_s()+'-'+style+".jpg", :disposition => 'inline'
    elsif @seedling.project_content_type == "image/gif"
      send_file REGISTRY[:data_dir]+"/seedlings/"+@seedling.id.to_s()+'-'+@seedling.friendly_id+'/project/'+@seedling.id.to_s()+'-'+style+".gif", :disposition => 'inline'
    end
  end
  
  def audio_message
    @seedling = Seedling.find(params[:id])
    send_file REGISTRY[:data_dir]+"/seedlings/"+@seedling.id.to_s()+'-'+@seedling.friendly_id+'/'+@seedling.id.to_s()+'-audio-message.mp3',
              :type => 'audio/mp3',
              :disposition => 'inline'
  end
  
  def guided_creation_new  
    @seedling = Seedling.new
    respond_to do |format|
      format.html {}
      format.xml{
        render :text=>@seedling.to_xml
      }
      format.json{
        render :text=>@seedling.to_json
      }
    end
  end
  
  def shorten_with_bitly(url)
    
    # required for Opening the bit.ly URL and conversion
    require 'open-uri'

    # create the URL for bit.ly API call
    user = "karunatree"
    apikey = "R_fb23f038adfb891a3cf351ef4bfceb14"
    bitly_url = "http://api.bit.ly/v3/shorten?login=#{user}&apiKey=#{apikey}&longUrl=#{url}&format=txt"
    
    # make the API call
    short_url = open(bitly_url, "UserAgent" => "Ruby-ExpandLink").read

    # return the shortened URL
    return short_url
 
  end 
  
  
end

