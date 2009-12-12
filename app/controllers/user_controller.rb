class UserController < ApplicationController
  include ApplicationHelper
  
  before_filter :protect, :except => [ :login, :signup ]
  
  def signup
    @title = "Sign Up for KarunaTree" 
    
    if param_posted?(:user)
      @user = User.new(params[:user]) 
      
      if @user.save
        @user.login!(session)
        flash[:notice] = "User #{@user.username} created successfully!"
        redirect_to_requested_url
      else
        @user.clear_password
      end
      
    end
  end
  
  
  def login
    @title = "Log In to KarunaTree"
    if request.get?
      @user = User.new(:remember_me => remember_me_string)
    elsif param_posted?(:user)
      @user = User.new(params[:user])
      user = User.find_by_username_and_password(@user.username, @user.password)
      if user
        user.login!(session)
        @user.remember_me? ? user.remember!(cookies) : user.forget!(cookies)
        flash[:notice] = "Welcome back, #{user.username}!"
        redirect_to_requested_url
      else
        @user.clear_password
        flash[:notice] = "Oops! We couldn't find a user with that username and password."
      end
    end
  end
  
  
  def logout
    User.logout!(session, cookies)
    flash[:notice] = "You are logged out. Come back soon!"
    redirect_to :action => "index", :controller => "site"
  end
  
  
  def index
    @title = "KarunaTree User Hub"
    @user = User.get_current_user(session)
    render :layout => "two-column"
  end
  
    
  
  
  private
  
  # Invoke from before_filter to keep non-logged-in users from seeing protected pages
  def protect
    unless logged_in?
      session[:protected_page] = request.request_uri
      flash[:notice] = "Please log in first."
      redirect_to :action => "login"
      return false
    end
  end
  
  # Return a string with the status of the remember me checkbox
  def remember_me_string
    cookies[:remember_me] || "0"
  end
  
  # Return true if a parameter corresponding to the given symbol was posted
  def param_posted?(symbol)
    request.post? and params[symbol]
  end
  
  # Redirect to the previously requested URL (if present). Else, redirect to user index page
  def redirect_to_requested_url
    if session[:protected_page]
      redirect_url = session[:protected_page]
      session[:protected_page] = nil
      redirect_to redirect_url
    else
      redirect_to :action => "index"
    end
  end

end
