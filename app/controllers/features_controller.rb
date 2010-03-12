class FeaturesController < ApplicationController
      
  # GET /features
  def index
    @features = Feature.all
  end
  
  # GET /features/locator
  # GET /features/locator.json
  def show
    #@feature = Feature.find(params[:id])
    @feature = Feature.find_by_locator(params[:id])
    
    respond_to do |format|
      format.html #show.html.haml
      format.json { render :json => @feature }
    end
  end
  
  # GET /features/locator/behavior
  # GET /features/locator/behavior.json
  def behavior
    @feature = Feature.find_by_locator(params[:id])
    
    respond_to do |format|
      format.html { render :text => @feature.behavior.to_json }
      format.json { render :json => @feature.behavior }
    end
  end
  
  # GET /features/new
  # Supporting GET /features/new.json could be cool in the future...
  def new
    @feature = Feature.new
  end
  
  # POST /features
  # Supporting POST /features.json could be cool in the future...
  def create
    @feature = Feature.new(params[:feature])
    if @feature.save
      flash[:notice] = "Successfully created feature."
      redirect_to @feature
    else
      render :action => 'new'
    end
  end
  
  # GET /features/locator/edit
  def edit
    #@feature = Feature.find(params[:id])
    @feature = Feature.find_by_locator(params[:id])
  end
  
  # PUT /features/locator
  # Supporting PUT /features/locator.xml could be cool in the future...
  def update
    #@feature = Feature.find(params[:id])
    @feature = Feature.find_by_locator(params[:id])
    if @feature.update_attributes(params[:feature])
      flash[:notice] = "Successfully updated feature."
      redirect_to @feature
    else
      render :action => 'edit'
    end
  end
  
  # DELETE /features/locator
  def destroy
    #@feature = Feature.find(params[:id])
    @feature = Feature.find_by_locator(params[:id])
    @feature.destroy
    flash[:notice] = "Successfully destroyed feature."
    redirect_to features_url
  end
  
end
