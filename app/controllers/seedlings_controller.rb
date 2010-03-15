class SeedlingsController < ApplicationController
  before_filter :require_user, :except => [:index, :show]
  # GET /seedlings
  # GET /seedlings.xml
  def index
    @seedlings = Seedling.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @seedlings }
    end
  end

  # GET /seedlings/1
  # GET /seedlings/1.xml
  def show
    @seedling = Seedling.find(params[:id])
    @main_image = @seedling.picture.url(params[:main_image])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @seedling }
    end
  end

  # GET /seedlings/new
  # GET /seedlings/new.xml
  def new
    @seedling = Seedling.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @seedling }
    end
  end

  # GET /seedlings/1/edit
  def edit
    @seedling = Seedling.find(params[:id])
  end

  # POST /seedlings
  # POST /seedlings.xml
  def create
    @seedling = Seedling.new(params[:seedling])
    @seedling.user = current_user

    respond_to do |format|
      if @seedling.save
        flash[:notice] = 'Seedling was successfully created.'
        format.html { redirect_to(@seedling) }
        format.xml  { render :xml => @seedling, :status => :created, :location => @seedling }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @seedling.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /seedlings/1
  # PUT /seedlings/1.xml
  def update
    @seedling = Seedling.find(params[:id])

    respond_to do |format|
      if @seedling.update_attributes(params[:seedling])
        flash[:notice] = 'Seedling was successfully updated.'
        format.html { redirect_to(@seedling) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @seedling.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /seedlings/1
  # DELETE /seedlings/1.xml
  def destroy
    @seedling = Seedling.find(params[:id])
    @seedling.destroy

    respond_to do |format|
      format.html { redirect_to(seedlings_url) }
      format.xml  { head :ok }
    end
  end
end
