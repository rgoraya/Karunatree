goog.provide('ktree.ktx.KtxDataSource');

goog.require('goog.ds.XmlHttpDataSource');

/**
*	@constructor
*	@param {string} uri 				The URI for the KTX (.xml) file to load
*	@param {string} dsName 				A string identifier by which the newly created KtxDataSource will be referenced
*/
ktree.ktx.KtxDataSource = function(uri, dsName) {
	goog.ds.XmlHttpDataSource.call(this, uri, dsName);
	
	this.root_;
}
goog.inherits(ktree.ktx.KtxDataSource, goog.ds.XmlHttpDataSource);



/**
*	@return {Element} The Element object corresponding to the root of this DataSource
*	(or null if no root exists).
*/
ktree.ktx.KtxDataSource.prototype.getRootElement = function() {
	return this.node_;
}

/**
*	We override the success_ method in order to save a reference to the root node
*	when the backing for the DataSource is loaded/reloaded.
*	@see goog.ds.XmlHttpDataSource#success_
*	@private
*	@override
*/
ktree.ktx.KtxDataSource.prototype.success_ = function() {
	ktree.ktx.KtxDataSource.superClass_.success_.call(this);
	this.root_ = this.node_;
}