require 'test_helper'

class UserTest < ActiveSupport::TestCase
  fixtures :users
  
  def setup
    @error_messages = I18n.translate('activerecord.errors.messages')
    @valid_user = users(:valid_user)
    @invalid_user = users(:invalid_user)
  end
  
  # This user should be valid by construction.
  def test_user_validity
    assert @valid_user.valid?
  end
  
  # This user should be invalid by construction.
  def test_user_invalidity
    assert !@invalid_user.valid?
    attributes = [:username, :email, :password]
    attributes.each do |attribute|
      assert @invalid_user.errors.invalid?(attribute)
    end
  end
  
  # Test for uniqueness of username and email
  def test_uniqueness_of_username_and_email
    user_repeat = User.new( :username => @valid_user.username,
                            :email => @valid_user.email,
                            :password => @valid_user.password )
    assert !user_repeat.valid?
    assert_equal @error_messages[:taken], user_repeat.errors.on(:username)
    assert_equal @error_messages[:taken], user_repeat.errors.on(:email)
  end
  
  # Test to make sure username can't be too short
  def test_username_minimum_length
    user = @valid_user
    min_length = User::USERNAME_MIN_LENGTH
    
    # Username too short
    user.username = "a" * (min_length -1)
    assert !user.valid?, "#{user.username} should raise a minimum length error"
    # Format the error message based on minimum length
    correct_error_message = I18n.translate"activerecord.errors.messages.too_short", :count => min_length
    assert_equal correct_error_message, user.errors.on(:username)
    
    # Username is minimum length
    user.username = "a" * min_length
    assert user.valid?, "#{user.username} should be just long enough to pass"
  end
  
  # Test to make sure username can't be too long
  def test_username_minimum_length
    user = @valid_user
    max_length = User::USERNAME_MAX_LENGTH
    
    # Username too long
    user.username = "a" * (max_length + 1)
    assert !user.valid?, "#{user.username} should raise a maximum length error"
    # Format the error message based on minimum length
    correct_error_message = I18n.translate"activerecord.errors.messages.too_long", :count => max_length
    assert_equal correct_error_message, user.errors.on(:username)
    
    # Username is maximum length
    user.username = "a" * max_length
    assert user.valid?, "#{user.username} should be just short enough to pass"
  end
  
  # Test to make sure password can't be too short
  def test_password_minimum_length
    user = @valid_user
    min_length = User::PASSWORD_MIN_LENGTH
    
    # Password too short
    user.password = "a" * (min_length -1)
    assert !user.valid?, "#{user.password} should raise a minimum length error"
    # Format the error message based on minimum length
    correct_error_message = I18n.translate"activerecord.errors.messages.too_short", :count => min_length
    assert_equal correct_error_message, user.errors.on(:password)
    
    # Password is minimum length
    user.password = "a" * min_length
    assert user.valid?, "#{user.password} should be just long enough to pass"
  end
  
  # Test to make sure password can't be too long
  def test_password_maximum_length
    user = @valid_user
    max_length = User::PASSWORD_MAX_LENGTH
    
    # Password too long
    user.password = "a" * (max_length + 1)
    assert !user.valid?, "#{user.password} should raise a maximum length error"
    # Format the error message based on minimum length
    correct_error_message = I18n.translate"activerecord.errors.messages.too_long", :count => max_length
    assert_equal correct_error_message, user.errors.on(:password)
    
    # Password is maximum length
    user.password = "a" * max_length
    assert user.valid?, "#{user.password} should be just short enough to pass"
  end
  
  # Test to make sure email can't be too long
  def test_email_maximum_length
    user = @valid_user
    max_length = User::EMAIL_MAX_LENGTH
    
    # Construct a valid email that is too long
    user.email = "a" * (max_length - user.email.length + 1) + user.email
    assert !user.valid?, "#{user.email} should raise a maximum length error"
    # Format the error message based on maximum length
    correct_error_message = I18n.translate"activerecord.errors.messages.too_long", :count => max_length
    assert_equal correct_error_message, user.errors.on(:email)
  end
  
  # Test the email validator against valid email addresses
  def test_email_with_valid_examples
    user = @valid_user
    valid_endings = %w{com org net edu es jp info us co.uk}
    valid_emails = valid_endings.collect do |ending|
      "foo.bar_1-9@baz-quux0.example.#{ending}"
    end
    valid_emails.each do |email|
      user.email = email
      assert user.valid?, "#{email} must be a valid email address"
    end
  end
  
  # Test the email validator against invalid email addresses
  def test_email_with_invalid_examples
    user = @valid_user
    invalid_emails = %w{foobar@example.c @example.com f@com foo@bar..com 
                        foobar@example.infod foobar.example.com foo,@example.com 
                        foo@ex(ample.com foo@example,com}
    invalid_emails.each do |email|
      user.email = email
      assert !user.valid?, "#{email} tests as valid but it shouldn't"
      assert_equal "must be a valid email address.", user.errors.on(:email)
    end
  end
      
  # Test the username validator against valid examples
  def test_username_with_valid_examples
    user = @valid_user
    valid_usernames = %w{diana fast-eddy green_kid brookie_22 web2.0}
    valid_usernames.each do |username|
      user.username = username
      assert user.valid?, "#{username} tested as invalid, but it shouldn't"
    end
  end
  
  # Test the username validator against invalid examples
  def test_username_with_invalid_examples
    user = @valid_user
    invalid_usernames = %w{rails/rocks javascript:something green$$eyes}
    invalid_usernames.each do |username|
      user.username = username
      assert !user.valid?, "#{username} tested as valid, but it shouldn't"
    end
  end
 
end
