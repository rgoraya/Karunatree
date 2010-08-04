class CommentsController < ApplicationController
  
  def index 
    @seedling = Seedling.find(params[:seedling_id]) 
    @comments = @seedling.comments
  end 
  
  def show
    @seedling = Seedling.find(params[:seedling_id])
    @comment = @seedling.comments.find(params[:id])
  end
  
  def new
    @seedling = Seedling.find(params[:seedling_id])
    @comment = @seedling.comments.build
  end
  
  def create
    @seedling = Seedling.find(params[:seedling_id])
    @comment = @seedling.comments.build(params[:comment])
    if @comment.save
      redirect_to seedling_comment_url(@seedling, @comment)
    else
      render :action => "new"
    end
  end
  
  def destroy
    @seedling = Seedling.find(params[:seedling_id])
    @comment = @seedling.find(params[:id])
    @comment.destroy
    
    respond_to do |format|
      format.html {redirect_to seedling_comments_path(@seedling)}
      format.xml {head :ok}
    end
  end
  
  
end

