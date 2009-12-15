require 'test_helper'

# Re-raise errors caught by the controller.
class RootController; def rescue_action(e) raise e end; end

class RootControllerTest < ActionController::TestCase
  def test_index
    get :index
    title = assigns(:title)
    assert_equal "Welcome to KarunaTree -- Environmental Literacy for Kids", title
    assert_response :success
    assert_template "index"
  end
  
  def test_about
    get :about
    title = assigns(:title)
    assert_equal "About KarunaTree", title
    assert_response :success
    assert_template "about"
  end
  
  def test_help
    get :help
    title = assigns(:title)
    assert_equal "KarunaTree Help", title
    assert_response :success
    assert_template "help"
  end
  
  # Test the navigation menu state prior to login
  def test_navigation_before_login
    get :index
    assert_tag "a", :content => /Sign Up!/,
                    :attributes => { :href => "/user/signup" }
    assert_tag "a", :content => /Login/,
                    :attributes => { :href => "/user/login" }
    # Test link_to_unless_current
    assert_no_tag "a", :content => /Home/
  end
  
end
