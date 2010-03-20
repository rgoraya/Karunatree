class ReviseUsersForAuthlogic < ActiveRecord::Migration
  def self.up
    remove_column :users, :password
    change_column :users, :username, :string, :null => false
    change_column :users, :email, :string, :null => false
    add_column :users, :crypted_password, :string, :null => false   #Used by Authlogic (optional)
    add_column :users, :password_salt, :string, :null => false      #Used by Authlogic (optional, highly recommended)
    add_column :users, :persistence_token, :string, :null => false  #Used by Authlogic (required)
    add_column :users, :perishable_token, :string, :null => false   #Used by Authlogic (optional)
    add_column :users, :account_type, :string, :null => false
  end

  def self.down
    add_column :users, :password, :string
    change_column :users, :username, :string
    change_column :users, :email, :string
    remove_column :users, :crypted_password
    remove_column :users, :password_salt
    remove_column :users, :persistence_token
    remove_column :users, :perishable_token
    remove_column :users, :account_type
  end
end
