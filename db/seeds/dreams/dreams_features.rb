print "... Seeding Features for Dreams.\n"

# Sam
sam = Feature.find_or_create_by_locator(
  :locator => 'sam',
  :name => 'Sam',
  :description => 'This is Sam.'
)
sam.behavior = Behavior.find_by_locator("sam-behavior")

# Sam's Mom
sams_mom = Feature.find_or_create_by_locator(
  :locator => 'sams-mom',
  :name => 'Sam&#8217;s Mom',
  :description => 'This is Sam&#8217;s Mom'
)
sams_mom.behavior = Behavior.find_by_locator("sams-mom-behavior")

# The Camp
camp = Feature.find_or_create_by_locator(
  :locator => 'camp',
  :name => 'Camp',
  :description => 'This is the camp that Sam and his Mom are staying in.'
)
camp.behavior = Behavior.find_by_locator("camp-behavior")

# The Brush
brush = Feature.find_or_create_by_locator(
  :locator => 'brush',
  :name => 'Small Brush',
  :description => 'A small excavation brush, useful for cleaning sediment off fragile specimens.'
)

# The Excavation Site
excavation_site = Feature.find_or_create_by_locator(
  :locator => 'excavation-site',
  :name => 'Excavation Site',
  :description => 'The site of the mysterious fossilized footprint.'
)
excavation_site.behavior = Behavior.find_by_locator("excavation-site-behavior")


