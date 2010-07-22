class SeedlingsController < ApplicationController
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
    @seedling = Seedling.find(params[:id])
    if @seedling.update_attributes(params[:seedling])
      flash[:notice] = "Successfully updated seedling."
      redirect_to @seedling
    else
      render :action => 'edit'
    end
  end
  
  def destroy
    @seedling = Seedling.find(params[:id])
    @seedling.destroy
    flash[:notice] = "Successfully destroyed seedling."
    redirect_to seedlings_url
  end
  
  def details
    @seedling = Seedling.find(params[:id])
    #redirect_to "/seedlings/#{@seedling.id}/details"
  end
end
