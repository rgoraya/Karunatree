// //Initialize global variables and load the API
// var ge;
// var string = "testing";
// google.load("earth", "1");
// 
// //Initialize the GE instance, with callbacks
// function init() {
// 	google.earth.createInstance('earth', initCB, failureCB);
// }
// 
// //Callback for succesful initialization
// function initCB(instance) {
// 	ge = instance;
// 	ge.getWindow().setVisibility(true);
// 	ge.getSun().setVisibility(true);
// 	ge.getOptions().setAtmosphereVisibility(true);
// 	ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);
// 	alert(user_id);
// }
// 
// //Callback for failed initialization
// function failureCB(errorCode) {
// }
// 
// //When the page has completely loaded, begin initialization
// google.setOnLoadCallback(init);
// window.onunload = GUnload;