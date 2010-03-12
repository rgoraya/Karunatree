print "... Seeding Behaviors for Dreams.\n"


sam_behavior = Behavior.find_or_create_by_locator(
  :locator => "sam-behavior"
  #:look_response => '<p>This will become a link to Sam&#8217;s inventory page.</p>',
  #:interact_response => '<p>This will become a link to Sam&#8217;s inventory page.</p>'
)

sams_mom_behavior = Behavior.find_or_create_by_locator(
  :locator => "sams-mom-behavior",
  :look_response => '<p>Sam&#8217;s Mom was wearing her favorite hat to shade her eyes from the bright sunlight. Concentration furrowed her brow as she examined the excavation site.</p>
                     <p>Beside her on the red dirt lay the familiar field pack and journal which she always kept close at hand on her expeditions.</p>',
  :interact_response => '<p>&#8220;Probably isn&#8217;t too much light left this afternoon for us to finish our excavation by. I wish I knew where those brushes were! Could you help me look for them?&#8221;</p>'                      
)

camp_behavior = Behavior.find_or_create_by_locator(
  :locator => "camp-behavior",
  :look_response => '<p>Sam and his Mom had made their camp close to the entrance of the canyon, where they could see far across the desert as they prepped their gear and ate meals. Several boxes of excavation tools were neatly stacked next to their tent.</p>',
  :interact_response => '<p>Back in camp, it only took Sam a moment to find the brushes. (They were perched on the folding table beside the tent, no doubt put there the night before by Sam&#8217;s Mom to make sure she wouldn&#8217;t forget them). Grabbing up a brush, Sam turned to trot back to where his Mom waited.</p>',
  :interact_trigger => '{ "add_inventory": "brush", "remove_feature": "Camp", "bind_behavior": { "feature_locator": "sams-mom", "behavior_locator": "sams-mom-receive-brush" }, "to_scene": "Dreams", "to_subscene": "3"}'
)

Behavior.find_or_create_by_locator(
  :locator => "sams-mom-receive-brush",
  :look_response => '<p>Sam&#8217;s Mom paced restlessly near the excavation site, double checking her pockets and muttering about her forgetfulness. The shadows were starting to grow longer as she searched, unable to continue without finding the brushes first.</p>',
  :interact_trigger => '{ "to_scene": "Dreams", "to_subscene": "4" }'
)

Behavior.find_or_create_by_locator(
  :locator => "excavation-site-behavior",
  :look_response => '<img width="768px" height="576px" src="images/illustrations/dreams.jpg">',
  :look_trigger => '{ "to_scene": "Dreams", "to_subscene": "5" }',
  :interact_response => '<img width="768px" height="576px" src="images/illustrations/dreams.jpg">',
  :interact_trigger => '{ "to_scene": "Dreams", "to_subscene": "5" }'
)