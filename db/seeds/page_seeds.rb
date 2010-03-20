print "Generating Dummy Pages...\n"

Page.find_or_create_by_title(
:title => "Index",
:content => "This page is under construction.",
:permalink => 'index'
);

Page.find_or_create_by_title(
:title => "About",
:content => "This page is under construction.",
:permalink => 'about'
);

Page.find_or_create_by_title(
:title => 'Help',
:content => "This page is under construction.",
:permalink => 'help'
);

print "Finished generating dummy pages. \n"