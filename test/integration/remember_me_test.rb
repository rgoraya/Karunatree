require 'test_helper'

class RememberMeTest < ActionController::IntegrationTest
  include ApplicationHelper
  
  fixtures :all

  def setup
    @user = users(:valid_user)
  end
  
  # Replace this with your real tests.
  test "test remember me" do
    # Log in with remember me enabled
    post "user/login", :user => { :username => @user.username,
                                  :password => @user.password,
                                  :remember_me => "1" }
    # Simulate closing the browser by clearing the user id from the session
    @request.session[:user_id] = nil
    assert !(logged_in?)
    # Now access an arbitrary page
    get "user/index"
    # The check_authorization filter should have logged us in
    assert logged_in?
    assert_equal @user.id, @request.session[:user_id]
  end
end
