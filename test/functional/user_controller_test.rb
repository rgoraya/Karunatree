require 'test_helper'

# Re-raise errors caught by the controller.
class SiteController; def rescue_action(e) raise e end; end

class UserControllerTest < ActionController::TestCase
  include ApplicationHelper
  fixtures :users
  
  def setup
    @controller = UserController.new
    @request = ActionController::TestRequest.new
    @response = ActionController::TestResponse.new
    @valid_user = users(:valid_user)
  end
  
  # Test the structure of the signup page
  def test_signup_page
    get :signup
    title = assigns(:title)
    assert_equal "Sign Up for KarunaTree", title
    assert_response :success
    assert_template "signup"
    
    # Test the signup form and all its tags
    assert_tag "form", :attributes => {   :action => "/user/signup",
                                          :method => "post" }
    assert_tag "input", :attributes => {  :name => "user[email]",
                                          :type => "text",
                                          :size => User::EMAIL_SIZE,
                                          :maxlength => User::EMAIL_MAX_LENGTH }
    assert_tag "input", :attributes => {  :name => "user[username]",
                                          :type => "text",
                                          :size => User::USERNAME_SIZE,
                                          :maxlength => User::USERNAME_MAX_LENGTH }
    assert_tag "input", :attributes => {  :name => "user[password]",
                                          :type => "password",
                                          :size => User::PASSWORD_SIZE,
                                          :maxlength => User::PASSWORD_MAX_LENGTH }
    assert_tag "input", :attributes => {  :type => "submit",
                                          :value => "Jump in!"}
  end
  
  # Test a valid signup
  def test_signup_success
    post :signup, :user => {  :username => "new_username",
                              :email => "valid@email.com",
                              :password => "valid_password" }
                              
    # Test assignment of user
    user = assigns(:user)
    assert_not_nil user
    
    #Test new user in database
    new_user = User.find_by_username_and_password(user.username, user.password)
    assert_equal new_user, user
    
    # Test that user is logged in correctly
    assert logged_in?
    assert_equal user.id, session[:user_id]
    
    #Test flash and redirect
    # assert_equal "User #{new_user.username} created successfully!", flash[:notice]
    assert_redirected_to :controller => "play", :action => "index"
  end
  
  # Test an invalid signup
  def test_signup_failure
    post :signup, :user => {  :username => "aa/noyes",
                              :email => "anoyes@example,com",
                              :password => "sun" }
    
    assert_response :success
    assert_template "signup"
    
    # Test display of error messages
    assert_tag "div", :attributes => {  :id => "errorExplanation",
                                        :class => "errorExplanation" }
                                        
    # Assert that each form field has at least one error displayed
    assert_tag "li", :content => /Username/
    assert_tag "li", :content => /Email/
    assert_tag "li", :content => /Password/
    
    # Test to see that the input fields are being wrapped with the correct div
    error_div = { :tag => "div", :attributes => { :class => "fieldWithErrors" } }
    
    assert_tag "input", :attributes => {  :name => "user[username]",
                                          :value => "aa/noyes" },
                        :parent => error_div
    assert_tag "input", :attributes => {  :name => "user[email]",
                                          :value => "anoyes@example,com" },
                        :parent => error_div
    assert_tag "input", :attributes => {  :name => "user[password]",
                                          :value => nil },
                        :parent => error_div             
  end
  
  # Test structure of the login page
  def test_login_page
    get :login
    title = assigns(:title)
    assert_equal "Log In to KarunaTree", title
    assert_response :success
    assert_template "login"
    assert_tag "form", :attributes => {   :action => "/user/login",
                                          :method => "post" }
    assert_tag "input", :attributes => {  :name => "user[username]",
                                          :type => "text",
                                          :size => User::USERNAME_SIZE,
                                          :maxlength => User::USERNAME_MAX_LENGTH }
    assert_tag "input", :attributes => {  :name => "user[password]",
                                          :type => "password",
                                          :size => User::PASSWORD_SIZE,
                                          :maxlength => User::PASSWORD_MAX_LENGTH }
    assert_tag "input", :attributes => {  :name => "user[remember_me]",
                                          :type => "checkbox"}
    assert_tag "input", :attributes => {  :type => "submit",
                                          :value => "Jump in!" }
  end
  
  # Test a valid login
  def test_login_success
    try_to_login @valid_user, :remember_me => "0"
    assert logged_in?
    assert_equal @valid_user.id, session[:user_id]
    # assert_equal "Welcome back, #{@valid_user.username}!", flash[:notice]
    assert_response :redirect
    assert_redirected_to :controller => "play", :action => "index"
    
    # Verify that we're not remembering the user
    user = assigns(:user)
    assert user.remember_me != "1"
    # There should be no cookies set
    assert_nil cookie_value(:remember_me)
    assert_nil cookie_value(:authorization_token)
  end
  
  # Test a valid login with "remember me"
  def test_login_success_with_remember_me
    try_to_login @valid_user, :remember_me => "1"
    test_time = Time.now
    assert logged_in?
    assert_equal @valid_user.id, session[:user_id]
    # assert_equal "Welcome back, #{@valid_user.username}!", flash[:notice]
    assert_response :redirect
    assert_redirected_to :controller => "play", :action => "index"
    
    # Check cookies and expiration dates
    user = User.find(@valid_user.id)
    time_range = 100 # Microsecond range for time agreement
    
    # Remember me cookie
    assert_equal "1", cookie_value(:remember_me)
    
    # This test does not work in Rails 2.3
    # assert_in_delta 1.years.from_now(test_time),
    #             cookie_expires(:remember_me),
    #             time_range
    
    # Authorization cookie
    assert_equal user.authorization_token, cookie_value(:authorization_token)
    
    # This test does not work in Rails 2.3
    # assert_in_delta 1.years.from_now(test_time),
    #                cookie_expires(:authorization_token),
    #                time_range
  end
  
  # Test an invalid login (bad username)
  def test_login_failure_with_nonexistant_username
    invalid_user = @valid_user
    invalid_user.username = "no such user"
    try_to_login invalid_user
    assert_template "login"
    assert_equal "Oops! We couldn't find a user with that username and password.", flash[:notice]
    # Make sure username will be redisplayed, but not the password
    user = assigns(:user)
    assert_equal invalid_user.username, user.username
    assert_nil user.password
  end
  
  # Test an invalid login (wrong password)
  def test_login_failure_with_wrong_password
    invalid_user = @valid_user
    invalid_user.password = "baz"
    try_to_login invalid_user
    assert_template "login"
    assert_equal "Oops! We couldn't find a user with that username and password.", flash[:notice]
    user = assigns(:user)
    assert_equal invalid_user.username, user.username
    assert_nil user.password
  end
  
  # Test the index page for a logged-in user
  def test_index_authorized
    authorize @valid_user
    get :index
    title = assigns(:title)
    assert_equal "KarunaTree User Hub", title
    assert_response :success
    assert_template "index"
  end
  
  # Test the index page for a non-logged-in user
  def test_index_unauthorized
    # Make sure the before_filter is working
    get :index
    assert_response :redirect
    assert_redirected_to :action => "login"
    assert_equal "Please log in first.", flash[:notice]
  end
  
  # Test friendly forwarding from login
  def test_login_friendly_forwarding
    user = {  :username => @valid_user.username,
              :password => @valid_user.password }
    friendly_url_forwarding_aux(:login, :index, user)
  end
  
  # Test friendly forwarding from registration
  def test_signup_friendly_fowarding
    user = {  :username => "brand_new_username",
              :email => "brand_new@user.com",
              :password => "valid_password" }
    friendly_url_forwarding_aux(:signup, :index, user)
  end
  
  # Test the state of the navigation bar after login
  def test_navigation_after_login
    authorize @valid_user
    get :index
    assert_tag "a", :content => /Logout/,
                    :attributes => { :href => "/user/logout" }
    assert_no_tag "a", :content => /Sign Up!/
    assert_no_tag "a", :content => /Login/ 
  end
  
  # Test logout
  def test_logout
    try_to_login @valid_user, :remember_me => "1"
    assert logged_in?
    assert_not_nil cookie_value(:authorization_token)
    get :logout
    assert_response :redirect
    assert_redirected_to :action => "index", :controller => "root"
    assert_equal "You are logged out. Come back soon!", flash[:notice]
    assert !logged_in?
    assert_nil cookie_value(:authorization_token)
  end
    
  
  private
  
  # Return the cookie value given a symbol. See p. 206 of RailsSpace
  def cookie_value(symbol)
    cookies[symbol.to_s]
  end
  
  # Return the cookie expiration given a symbol.
  def cookie_expiration(symbol)
    cookies[symbol.to_s].expires
  end
  
  # Try to log a user in using the login action.
  # Pass :remember_me => "1" or :remember_me => "0" in options
  # to turn the "remember me" mechanism on/off
  def try_to_login(user, options = {})
    user_hash = { :username => user.username,
                  :password => user.password }
    user_hash.merge!(options)
    post :login, :user => user_hash
  end
  
  # Authorize a user
  def authorize(user)
    @request.session[:user_id] = user.id
  end
  
  def friendly_url_forwarding_aux(test_page, protected_page, user)
    get protected_page
    assert_response :redirect
    assert_redirected_to :action => "login"
    assert_not_nil session[:protected_page]
    post test_page, :user => user
    assert_response :redirect
    assert_redirected_to :action => protected_page
    assert_nil session[:protected_page]
  end
  
end
