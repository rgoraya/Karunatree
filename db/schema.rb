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

ActiveRecord::Schema.define(:version => 20100809185735) do

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
    t.integer  "user_id",                        :null => false
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

  create_table "comments", :force => true do |t|
    t.string   "author"
    t.text     "body"
    t.integer  "seedling_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "features", :force => true do |t|
    t.string   "locator",      :null => false
    t.string   "name"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "character_id"
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
    t.string   "title",                                                                   :null => false
    t.text     "description"
    t.decimal  "lat",                        :precision => 9, :scale => 6,                :null => false
    t.decimal  "lon",                        :precision => 9, :scale => 6,                :null => false
    t.integer  "alt"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "project_file_name"
    t.string   "project_content_type"
    t.integer  "project_file_size"
    t.datetime "project_updated_at"
    t.string   "audio_message_file_name"
    t.string   "audio_message_content_type"
    t.integer  "audio_message_file_size"
    t.datetime "audio_message_updated_at"
    t.string   "authors"
    t.string   "short_url"
    t.integer  "likes",                                                    :default => 0, :null => false
    t.integer  "views",                                                    :default => 0, :null => false
  end

  create_table "seedlings_tags", :id => false, :force => true do |t|
    t.integer "seedling_id"
    t.integer "tag_id"
  end

  create_table "seedlings_users", :id => false, :force => true do |t|
    t.integer "seedling_id"
    t.integer "user_id"
  end

  create_table "sessions", :force => true do |t|
    t.string   "session_id", :null => false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], :name => "index_sessions_on_session_id"
  add_index "sessions", ["updated_at"], :name => "index_sessions_on_updated_at"

  create_table "slugs", :force => true do |t|
    t.string   "name"
    t.integer  "sluggable_id"
    t.integer  "sequence",                     :default => 1, :null => false
    t.string   "sluggable_type", :limit => 40
    t.string   "scope"
    t.datetime "created_at"
  end

  add_index "slugs", ["name", "sluggable_type", "sequence", "scope"], :name => "index_slugs_on_n_s_s_and_s", :unique => true
  add_index "slugs", ["sluggable_id"], :name => "index_slugs_on_sluggable_id"

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

  create_table "taggings", :force => true do |t|
    t.integer  "seedling_id"
    t.integer  "tag_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tags", :force => true do |t|
    t.string   "name",       :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "username",            :null => false
    t.string   "email",               :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "authorization_token"
    t.string   "crypted_password",    :null => false
    t.string   "password_salt",       :null => false
    t.string   "persistence_token",   :null => false
    t.string   "perishable_token",    :null => false
    t.string   "account_type",        :null => false
    t.boolean  "girlsinc"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.string   "first_name"
    t.string   "last_name"
  end

end
