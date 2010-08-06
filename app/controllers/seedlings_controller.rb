class SeedlingsController < ApplicationController
  auto_complete_for :seedling, :title
  
  def index
    @seedlings = Seedling.find(:all)
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
  
  def show
    @seedling = Seedling.find(params[:id])
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
  
  def new
    @seedling = Seedling.new
  end
  
  def create
    @seedling = Seedling.new(params[:seedling])
    if @seedling.save
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
  
  def testCSS
    @seedling = Seedling.find(params[:id])
  end
  
  /#
  def post_comment
    
    @comment =  @seedling.comments.build(
      "author" => params[:author]['author'] 
      "body" => params[:body]['body']
      "created_at" => Time.now
    )
    if @comment.save
      flash[:notice] = 'Comment was successfully added.'     
      #redirect_to :action => 'show', :id => flash[:post_id]
      @seedling = Post.find(flash[:post_id])
      @seedling_comments = @seedling.comments.collect    
      flash[:seedling_id] = @seedling.id  #Store the post.id back in the flash 
    end    
  end
  #/
  def project
    @seedling = Seedling.find(params[:id])
    style = params[:style] ? params[:style] : 'original'
    send_file REGISTRY[:data_dir]+"/seedlings/"+@seedling.id.to_s()+'-'+@seedling.friendly_id+'/project/'+@seedling.id.to_s()+'-'+style+'.jpg',
              :disposition => 'inline'
  end
  
  def audio_message
    @seedling = Seedling.find(params[:id])
    send_file "/Users/derek/code/kt/public/data/seedlings/"+@seedling.id.to_s()+'-'+@seedling.friendly_id+'/'+@seedling.id.to_s()+'-audio-message.mp3',
    #send_file REGISTRY[:data_dir]+"/seedlings/"+@seedling.id.to_s()+'-'+@seedling.friendly_id+'/'+@seedling.id.to_s()+'-audio-message.mp3',
              :type => 'audio/mp3',
              :disposition => 'inline'
  end
  
  def details
    @seedling = Seedling.find(params[:id])
    #redirect_to "/seedlings/#{@seedling.id}/details"
  end
  
end
