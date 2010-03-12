print "Deleting existing Sounds in database...\n"
Sound.delete_all()

print "Seeding Sounds to database...\n"

Sound.find_or_create_by_name(
  :name => 'dreams-soundtrack',
  :path => 'music/floating-bamboo-free.mp3',
  :start_position => 4500,
  :fade_in_duration => 1000,
  :fade_down_delay => 11000
)

Sound.find_or_create_by_name(
  :name => 'desert-wind',
  :path => 'ambient/desert-wind.mp3',
  :volume => 40,
  :fade_in_duration => 0,
  :loop => true
)

Sound.find_or_create_by_name(
  :name => 'awakening-soundtrack',
  :path => 'music/the-dimpled-cheek-free.mp3',
  :volume => 40,
  :fade_down_delay => 11000
)

Sound.find_or_create_by_name(
  :name => 'the-gift-soundtrack',
  :path => 'music/triosante-allegro-free.mp3',
  :volume => 40
)

Sound.find_or_create_by_name(
  :name => 'waves-on-beach',
  :path => 'ambient/waves-on-beach.mp3',
  :loop => true
)

Sound.find_or_create_by_name(
  :name => 'airborne-wind-and-waves',
  :path => 'ambient/airborne-wind-and-waves.mp3',
  :loop => true
)

Sound.find_or_create_by_name(
  :name => 'airborne-wind-and-waves-muffled',
  :path => 'ambient/airborne-wind-and-waves.mp3',
  :volume => 30,
  :loop => true
)

Sound.find_or_create_by_name(
  :name => 'alone-in-the-dark-soundtrack',
  :path => 'music/tribe-free.mp3',
  :volume => 40
)

Sound.find_or_create_by_name(
  :name => 'grotto-soundtrack',
  :path => 'music/haiku-free.mp3',
  :volume => 40
)

Sound.find_or_create_by_name(
  :name => 'cave-growls',
  :path => 'ambient/cave-growls.mp3'
)