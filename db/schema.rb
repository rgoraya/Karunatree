# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20100310002805) do

  create_table "behavior_bindings", :force => true do |t|
    t.string   "locator",      :null => false
    t.integer  "character_id", :null => false
    t.integer  "behavior_id",  :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "behaviors", :force => true do |t|
    t.string   "locator",           :null => false
    t.text     "description"
    t.text     "look_response"
    t.string   "look_trigger"
    t.text     "interact_response"
    t.string   "interact_trigger"
    t.integer  "feature_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "characters", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "saved_kml"
    t.string   "scene_name", :default => "None", :null => false
    t.integer  "subscene",   :default => 0,      :null => false
    t.integer  "feature_id"
  end

  create_table "characters_features", :id => false, :force => true do |t|
    t.integer "character_id"
    t.integer "feature_id"
  end

  create_table "features", :force => true do |t|
    t.string   "locator",      :null => false
    t.string   "name"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "character_id"
  end

  create_table "pages", :force => true do |t|
    t.string   "title"
    t.text     "content"
    t.string   "permalink"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "scenes", :force => true do |t|
    t.text     "name",                               :null => false
    t.text     "script"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "has_kml",         :default => false, :null => false
    t.integer  "dropcap",         :default => 0,     :null => false
    t.string   "soundtrack"
    t.string   "ambient_sound"
    t.integer  "subscene",        :default => 0,     :null => false
    t.string   "next_scene_name"
    t.integer  "next_subscene"
    t.string   "prev_scene_name"
    t.string   "prev_subscene"
  end

  create_table "seedlings", :force => true do |t|
    t.integer  "user_id"
    t.string   "title",                :default => "", :null => false
    t.string   "description",          :default => "", :null => false
    t.integer  "votes",                :default => 0,  :null => false
    t.integer  "transplanted_count",   :default => 0,  :null => false
    t.string   "picture_file_name"
    t.string   "picture_content_type"
    t.integer  "picture_file_size"
    t.datetime "picture_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sessions", :force => true do |t|
    t.string   "session_id", :null => false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], :name => "index_sessions_on_session_id"
  add_index "sessions", ["updated_at"], :name => "index_sessions_on_updated_at"

  create_table "sounds", :force => true do |t|
    t.string   "name",                                  :null => false
    t.string   "path",                                  :null => false
    t.integer  "volume"
    t.integer  "start_position"
    t.integer  "fade_in_delay"
    t.integer  "fade_in_duration"
    t.integer  "fade_down_delay"
    t.integer  "fade_down_duration"
    t.integer  "fade_down_volume"
    t.boolean  "loop",               :default => false, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string  "login",             :null => false
    t.string  "email",             :null => false
    t.string  "account_type",      :null => false
    t.string  "crypted_password",  :null => false
    t.string  "password_salt",     :null => false
    t.string  "persistence_token", :null => false
    t.string  "perishable_token",  :null => false
    t.integer "character_id"
  end

end
