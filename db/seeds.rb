#   Karunatree
#   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
#   
#   Author: Derek Lyons

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#   
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Major.create(:name => 'Daley', :city => cities.first)

# Last Updated: 12/17/2009

# Get the path for this file so that we can specify where other seeds live
path = File.dirname(__FILE__)

# Purge existing database
#Scenes.delete_all()

# Scenes
print "Loading Dreams ----------\n"
load path + '/seeds/dreams/dreams_behaviors.rb'
load path + '/seeds/dreams/dreams_features.rb'

# Sounds
print "Loading Sounds ----------\n"
load path + '/seeds/sound_seeds.rb'

print "All finished! ----------\n"