// Remove_Unused_Layers.jsx
// A Photoshop script by Bruno Herfst

// This script will delete all layers that are not in use
// If there are layer comps present, it will ask if you'd like to keep them.

// Note: it does not remove layers that are clipped to the background.
// No one would do that, right? ;)

#target photoshop

function main(){
    var layercomps = false;
    if(!documents.length) return;
    var doc = app.activeDocument;
    if(!doc.saved){
        if(!confirm("Your document is not saved. \nAre you sure you want to continue?")){
            return;
        }
    }
    if(doc.layerComps.length != 0){
        if(!confirm("Do you want me to safe your Layer Compositions? \nClicking 'No' will only safe layers that are visible at this moment.")){
            removeAllLayerComps(doc);
        } else {
            layercomps = true;
        }
    }

	// Add curent view into a layer comp
    doc.layerComps.add("mail@brunoherfst.com"); //unique

	// remove all invisible layers
	// collect all layers and safe the layer ID and Keep flag
    selectAllLayers();
    var layersSelected=getSelectedLayersIdx();
    var layerIDs=[];
    for(var d=0; d<layersSelected.length; d++){
        layerIDs.push([layersSelected[d],"N"]);
    }
	deselectLayers();

    // Now check which layers we need to save by going through all layer comps
    for( var c = 0; c < doc.layerComps.length; c++ ){
        doc.layerComps[c].apply(); // Load the layer-comp and see what needs saving
        for(var z in layerIDs){
            if(getLayerVisibilityByIndex( Number(layerIDs[z][0]))){
                layerIDs[z][1] = "Y";
            }
        }
    }

	// We need to make sure clipping layers are selected too
	var clippingLayerIDs=[];
	for(var l in layerIDs) {
        if(layerIDs[l][1].toString() == "N") {
        	var LID = Number(layerIDs[l][0]); // Layer ID
        	var clipInfo = isClippingLayer( LID );
        	if(clipInfo == 'bottomClippingLayer'){
        		LID++; // Move on to the layers in questions
        		while ( isClippingLayer(LID) ) {
        			clipInfo = isClippingLayer( LID );
        			// Make sure we are not moving into the next clipping group!
        			if(clipInfo != 'bottomClippingLayer'){
        				clippingLayerIDs.push([LID,"N"]);
						//selectLayerByIndex(LID, true); //test
						LID++;
        			} else {
        				break; // while loop
        			}
        		}
        	}
        }
    }
	layerIDs = layerIDs.concat(clippingLayerIDs);

	// Select all layers to be deleted
    for(var l in layerIDs) {
        if(layerIDs[l][1].toString() == "N") {
        	selectLayerByIndex(Number(layerIDs[l][0]), true);
        }
    }
	// delete selected layers
	doc.activeLayer.remove();

	// THE ACTIONS BELOW WILL NEED TO HAVE THEIR LAYER IDS SAFED AND CHECKED FOR CLIPPING LAYERS TOO
	// THE STUFF ABOVE SHOULD BE REWRITTEN TO A FUNCTION: removeAllInvissibleLayers(doc, layercomps);

    removeAllEmptyArtLayers(doc, layercomps); //If layer is part of a clipping layer we can remove the whole clippinggroup
    removeEmptyLayerSets();

    doc.layerComps["mail@brunoherfst.com"].remove();
    doc.selection.deselect();

    alert("Done cleaning layers!");
}

function isClippingLayer(layerID){
	var clipInfo=false;

	var ref = new ActionReference();
	    ref.putIndex(charIDToTypeID("Lyr "), layerID);

	try{
		var desc = executeActionGet(ref);
	} catch(e) {
		// Not a valid layer
		return clipInfo;
	}

	var group = desc.getBoolean(stringIDToTypeID('group'));
	if(group) clipInfo = 'topClippingLayer';

	try{
   		var ref = new ActionReference();
   		ref.putIndex(charIDToTypeID( 'Lyr ' ), layerID+1 );
   		desc =  executeActionGet(ref);
	}catch(e){
		//alert("Top layer!");
		return clipInfo;
	}

    group = desc.getBoolean(stringIDToTypeID('group'));
    if(group && clipInfo == 'topClippingLayer' ) clipInfo = 'middleClippingLayer';
    if(group && clipInfo == false ) clipInfo = 'bottomClippingLayer';
    return clipInfo;
};

function isAdjustmentLayer(){
	var ref = new ActionReference();
	ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
	return executeActionGet(ref).hasKey(stringIDToTypeID('adjustment'));
}

function removeAllLayerComps(doc){
    for( var i = doc.layerComps.length-1; i >= 0 ; i-- ){
        doc.layerComps[i].remove();
    }
}

function removeEmptyLayerSets(){
    var numberOfPasses=3;
    for(var o = 0;o<numberOfPasses;o++){
        selectAllLayers();
        var sel = getSelectedLayersIdx();
        var layerSets= [];
        for (var a in sel){
            if( isLayerSet( Number(sel[a]) )){
                layerSets.push(getIDX(Number(sel[a]) ));
            }
        }
        for(var p in layerSets){
            selLayer(Number(layerSets[p]),false);
            if(activeDocument.activeLayer.layers.length == 0){
                try{
                    if(activeDocument.activeLayer.typename == "LayerSet") activeDocument.activeLayer.remove();
                }catch(e){}
            }
        }
    }
}

function removeAllEmptyArtLayers(obj, layercomps) {
    function isLayerEmptyOrOffCanvas(layerRef) {
        function cTID(s) { return app.charIDToTypeID(s); };

        var desc47 = new ActionDescriptor();
        var ref22 = new ActionReference();
            ref22.putProperty( cTID('Chnl'), cTID('fsel') );
            desc47.putReference( cTID('null'), ref22 );
            var ref23 = new ActionReference();
            ref23.putEnumerated( cTID('Chnl'), cTID('Chnl'), cTID('Trsp') );
            ref23.putName( cTID('Lyr '), layerRef.name );
        desc47.putReference( cTID('T   '), ref23 );
        executeAction( cTID('setd'), desc47, DialogModes.NO );

        var bounds = layerRef.bounds;
        var docRef = activeDocument;

        var layerSetRef = docRef.layerSets.add();
        var layerRef = layerSetRef.artLayers.add();
        try{
            docRef.selection.fill( app.foregroundColor);
        } catch(e){
           //alert("off-canvas!");
           bounds = ["0 px","0 px","0 px","0 px"];
        }
        layerSetRef.remove();
        for (var i = 0; i < bounds.length; i++) {
            if (parseFloat(bounds[i]) > 0) {
                return false;
            }
        }
        return true;
    };

    for( var i = obj.artLayers.length-1; 0 <= i; i--) {
        try {
            if(layercomps){
                if (obj.artLayers[i].kind == LayerKind.NORMAL && obj.artLayers[i].bounds[2] == 0 && obj.artLayers[i].bounds[3] == 0){
                    obj.artLayers[i].remove();
                }
            } else {
				// we can do a deeper clean if layers are not attached to layer compositions.
				if (isLayerEmptyOrOffCanvas(obj.artLayers[i])){
					obj.artLayers[i].remove();
				}
			}
        } catch (e) {
            //do nothing
        }
    }
    for( var i = obj.layerSets.length-1; 0 <= i; i--) {
        removeAllEmptyArtLayers(obj.layerSets[i], layercomps);
    }
}

function getIDX(idx) {
    var ref = new ActionReference();
    ref.putProperty( charIDToTypeID("Prpr") , stringIDToTypeID( "layerID" ));
    ref.putIndex( charIDToTypeID( "Lyr " ), idx );
    return executeActionGet(ref).getInteger(stringIDToTypeID( "layerID" ));
}

function isLayerSet(idx){
  var propName = stringIDToTypeID( 'layerSection' );// can't replace
   var ref = new ActionReference();
   ref.putProperty( 1349677170 , propName);
   ref.putIndex( 1283027488, idx );
   var desc =  executeActionGet( ref );
   var type = desc.getEnumerationValue( propName );
   var res = typeIDToStringID( type );
   return res == 'layerSectionStart' ? true:false;
}

function getLayerVisibilityByIndex( idx ) {
    var ref = new ActionReference();
    ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "Vsbl" ));
    ref.putIndex( charIDToTypeID( "Lyr " ), idx );
    return executeActionGet(ref).getBoolean(charIDToTypeID( "Vsbl" ));
}

function getLayerItemIndexByLayerID(id) {
    var ref = new ActionReference();
    ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "ItmI" ));
    ref.putIdentifier( charIDToTypeID( "Lyr " ), id );
    try{
        return executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" ));
    }catch(e){return true;}
}

function selLayer(layerID,add){
    var result = getLayerItemIndexByLayerID(layerID);
    if(result > 0){
        try{
            activeDocument.backgroundLayer;
            var bkGround = 1;
        }catch(e) {
            var bkGround = 0;
        }
        selectLayerByIndex(result - bkGround ,add);
    } else {
        alert("Layer does not exist");
    }
}

function selectLayerByIndex(index,add){
    add = (add == undefined)  ? add = false : add;
    var ref = new ActionReference();
        ref.putIndex(charIDToTypeID("Lyr "), index);
        var desc = new ActionDescriptor();
        desc.putReference(charIDToTypeID("null"), ref );
             if(add) desc.putEnumerated( stringIDToTypeID( "selectionModifier" ), stringIDToTypeID( "selectionModifierType" ), stringIDToTypeID( "addToSelection" ) );
          desc.putBoolean( charIDToTypeID( "MkVs" ), false );
         try{
        executeAction(charIDToTypeID("slct"), desc, DialogModes.NO );
    }catch(e){}
}

function selectAllLayers() {
    var desc29 = new ActionDescriptor();
        var ref23 = new ActionReference();
        ref23.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
    desc29.putReference( charIDToTypeID('null'), ref23 );
    executeAction( stringIDToTypeID('selectAllLayers'), desc29, DialogModes.NO );
}

function deselectLayers() {
    var desc01 = new ActionDescriptor();
        var ref01 = new ActionReference();
        ref01.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
    desc01.putReference( charIDToTypeID('null'), ref01 );
    executeAction( stringIDToTypeID('selectNoLayers'), desc01, DialogModes.NO );
};

function getSelectedLayersIdx(){
   var selectedLayers = new Array;
   var ref = new ActionReference();
   ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
   var desc = executeActionGet(ref);
   if( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) ){
      desc = desc.getList( stringIDToTypeID( 'targetLayers' ));
       var c = desc.count
       var selectedLayers = new Array();
       for(var i=0;i<c;i++){
         try{
            activeDocument.backgroundLayer;
            selectedLayers.push(  desc.getReference( i ).getIndex() );
         }catch(e){
            selectedLayers.push(  desc.getReference( i ).getIndex()+1 );
         }
       }
    }else{
      var ref = new ActionReference();
      ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "ItmI" ));
      ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
      try{
         activeDocument.backgroundLayer;
         selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" ))-1);
      }catch(e){
         selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" )));
      }
   }
   return selectedLayers;
}

// Set the wheels in motion!
main();

//EOF
