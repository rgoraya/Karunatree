#   Karunatree
#   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
#   
#   Authors: Derek Lyons & Mike Chai

class UsersController < ApplicationController
  before_filter :require_no_user, :only => [:new, :create]
  before_filter :require_user, :only => [:edit, :update]
  
  def new
    @user = User.new
  end
  
  def create
    @user = User.new(params[:user])
    if @user.save
      flash[:notice] = "Account registered!"
      redirect_back_or_default user_path(@user)
    else
      render :action => :new
    end
  end
  
  def show
    # Note that we find by username here to be consistent with the way User models generate URLs
    # (see User::to_param)
    @user = User.find_by_username(params[:id])
  end
 
  def edit
    @user = @current_user
  end
  
  def update
    @user = @current_user # makes our views cleaner and more consistent
    if @user.update_attributes(params[:user])
      flash[:notice] = "Account updated!"
      redirect_to user_path(@user)
    else
      render :action => :edit
    end
  end
  
  def avatar
    @user = User.find_by_username(params[:id])
    style = params[:style] ? params[:style] : 'original'
    send_file REGISTRY[:data_dir]+"/users/"+@user.username+'/avatar/'+@user.id.to_s()+'-'+style+'.jpg',
              :disposition => 'inline'
  end
  
end
