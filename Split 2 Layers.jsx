//  photoshopscripts.wordpress.com

////////////////////////////////////
//       Split to Layers 1.0      //
//       2012, David Jensen       //
//                                //
//         With help from         //
//   pfaffenbichler and xbytor    //
//        at ps-scripts.com       //
////////////////////////////////////

#target photoshop

//Change any of the following 5 values to customize the default options for the script:

var showOptionsDialog = true; //Set to false to disable prompt to user.
var tolerance = 0;            // the largest gap of transparent pixels that will be ignored. Also sets default
var confirmThreshold = 20;    // If the script is going to make a large number of layers, prompt user to confirm that this is OK
var suffix = " - ";           // Add this to the Layer name of new Layers.  Set to "" for no additions.
var addCount = true;          // Add a numeral to the end of each new Layer


///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
var layerNamePreview=activeDocument.activeLayer.name + suffix;
if (addCount === true){
    layerNamePreview += "1";
}

var originalRulerUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.POINTS;

bounds = activeDocument.activeLayer.bounds
var emptyLayer=false;
if (Number(bounds[0]) == 0 && Number(bounds[1]) == 0 && Number(bounds[2]) == 0 && Number(bounds[3]) == 0) {emptyLayer = true};

try{
    if (activeDocument.activeLayer.kind != undefined && activeDocument.activeLayer.isBackgroundLayer == false && emptyLayer == false){
        activeDocument.suspendHistory("Separate", "main()");
    }else{
        alert( "A supported layer kind is not selected.");
    }
}catch(err){
    alert(err)
}

app.preferences.rulerUnits = originalRulerUnits;

function main() {
        
    var ok=createDialog();
    if (ok===2){
        activeDocument.selection.deselect()
        return false;
    }
    baseLayer=activeDocument.activeLayer;
    activeDocument.quickMaskMode = false;
    activeDocument.selection.deselect()
    var layerName = activeDocument.activeLayer.name
    //if a selection can't be made, stop running the script
  
 
    var idCpTL = charIDToTypeID("CpTL");
    executeAction(idCpTL, undefined, DialogModes.NO);
    
    activeDocument.activeLayer.rasterize(RasterizeType.ENTIRELAYER)
    try{
        var idDlt = charIDToTypeID( "Dlt " );
        var desc120 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
        var ref112 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idChnl = charIDToTypeID( "Chnl" );
        var idMsk = charIDToTypeID( "Msk " );
        ref112.putEnumerated( idChnl, idChnl, idMsk );
        desc120.putReference( idnull, ref112 );
        var idAply = charIDToTypeID( "Aply" );
        desc120.putBoolean( idAply, true );
        executeAction( idDlt, desc120, DialogModes.NO );
    }catch(e){}
    
    
    
    activeDocument.activeLayer.name = layerName

    baseLayer=activeDocument.activeLayer


    
    makeSelection()

    var idMk = charIDToTypeID("Mk  ");
    var desc642 = new ActionDescriptor();
    var idNw = charIDToTypeID("Nw  ");
    var idDcmn = charIDToTypeID("Dcmn");
    desc642.putClass(idNw, idDcmn);
    var idUsng = charIDToTypeID("Usng");
    var ref535 = new ActionReference();
    var idChnl = charIDToTypeID("Chnl");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref535.putEnumerated(idChnl, idOrdn, idTrgt);
    desc642.putReference(idUsng, ref535);
    executeAction(idMk, desc642, DialogModes.NO);

    newDoc = activeDocument
    // =======================================================
    activeDocument.resizeImage("200%", "200%", undefined, ResampleMethod.NEARESTNEIGHBOR)

    // =======================================================
    var idsetd = charIDToTypeID("setd");
    var desc934 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref535 = new ActionReference();
    var idChnl = charIDToTypeID("Chnl");
    var idfsel = charIDToTypeID("fsel");
    ref535.putProperty(idChnl, idfsel);
    desc934.putReference(idnull, ref535);
    var idT = charIDToTypeID("T   ");
    var ref536 = new ActionReference();
    var idChnl = charIDToTypeID("Chnl");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref536.putEnumerated(idChnl, idOrdn, idTrgt);
    desc934.putReference(idT, ref536);
    executeAction(idsetd, desc934, DialogModes.NO);


    var idMk = charIDToTypeID("Mk  ");
    var desc403 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref288 = new ActionReference();
    var idPath = charIDToTypeID("Path");
    ref288.putClass(idPath);
    desc403.putReference(idnull, ref288);
    var idFrom = charIDToTypeID("From");
    var ref289 = new ActionReference();
    var idcsel = charIDToTypeID("csel");
    var idfsel = charIDToTypeID("fsel");
    var idfsel = charIDToTypeID("fsel");
    ref289.putProperty(idcsel, idfsel);
    desc403.putReference(idFrom, ref289);
    var idTlrn = charIDToTypeID("Tlrn");
    var idPxl = charIDToTypeID("#Pxl");
    desc403.putUnitDouble(idTlrn, idPxl, 0.500000);
    executeAction(idMk, desc403, DialogModes.NO);
    
    var subPathsLength = activeDocument.pathItems[0].subPathItems.length
    
    if (subPathsLength>confirmThreshold){
        var answer = confirm("Up to "+subPathsLength+ " layers will be created. Would you like to continue?",true)
        if (answer === false){
            newDoc.close(SaveOptions.DONOTSAVECHANGES);
            activeDocument.quickMaskMode = false;
            activeDocument.selection.deselect();
            return 0;
        }
    
    }

    // =======================================================
    activeDocument.resizeImage("50%", "50%", undefined, ResampleMethod.NEARESTNEIGHBOR)

    var pathInfo = collectPathInfoFromDesc(activeDocument, activeDocument.pathItems[activeDocument.pathItems.length - 1])
    
    // =======================================================
    newDoc.close(SaveOptions.DONOTSAVECHANGES)

    // =======================================================
    activeDocument.quickMaskMode = false

    // =======================================================
    //make channel
    // =======================================================
    var idMk = charIDToTypeID("Mk  ");
    var desc6 = new ActionDescriptor();
    var idNw = charIDToTypeID("Nw  ");
    var desc7 = new ActionDescriptor();
    var idNm = charIDToTypeID("Nm  ");
    desc7.putString(idNm, "ContiguityMask");
    var idClrI = charIDToTypeID("ClrI");
    var idMskI = charIDToTypeID("MskI");
    var idMskA = charIDToTypeID("MskA");
    desc7.putEnumerated(idClrI, idMskI, idMskA);
    var idClr = charIDToTypeID("Clr ");
    var desc8 = new ActionDescriptor();
    var idRd = charIDToTypeID("Rd  ");
    desc8.putDouble(idRd, 255.000000);
    var idGrn = charIDToTypeID("Grn ");
    desc8.putDouble(idGrn, 0.000000);
    var idBl = charIDToTypeID("Bl  ");
    desc8.putDouble(idBl, 0.000000);
    var idRGBC = charIDToTypeID("RGBC");
    desc7.putObject(idClr, idRGBC, desc8);
    var idOpct = charIDToTypeID("Opct");
    desc7.putInteger(idOpct, 50);
    var idChnl = charIDToTypeID("Chnl");
    desc6.putObject(idNw, idChnl, desc7);
    var idUsng = charIDToTypeID("Usng");
    var ref5 = new ActionReference();
    var idChnl = charIDToTypeID("Chnl");
    var idfsel = charIDToTypeID("fsel");
    ref5.putProperty(idChnl, idfsel);
    desc6.putReference(idUsng, ref5);
    executeAction(idMk, desc6, DialogModes.NO);


    var layerCount = 1
    for (i = 0; i < subPathsLength; i++) {
        //deselect
        var idsetd = charIDToTypeID("setd");
        var desc279 = new ActionDescriptor();
        var idnull = charIDToTypeID("null");
        var ref137 = new ActionReference();
        var idChnl = charIDToTypeID("Chnl");
        var idfsel = charIDToTypeID("fsel");
        ref137.putProperty(idChnl, idfsel);
        desc279.putReference(idnull, ref137);
        var idT = charIDToTypeID("T   ");
        var idOrdn = charIDToTypeID("Ordn");
        var idNone = charIDToTypeID("None");
        desc279.putEnumerated(idT, idOrdn, idNone);
        executeAction(idsetd, desc279, DialogModes.NO);
        ///select alpha channel
        var idslct = charIDToTypeID("slct");
        var desc315 = new ActionDescriptor();
        var idnull = charIDToTypeID("null");
        var ref175 = new ActionReference();
        var idChnl = charIDToTypeID("Chnl");
        ref175.putName(idChnl, "ContiguityMask");
        desc315.putReference(idnull, ref175);
        executeAction(idslct, desc315, DialogModes.NO);
        //use magic wand
        var idsetd = charIDToTypeID("setd");
        var desc263 = new ActionDescriptor();
        var idnull = charIDToTypeID("null");
        var ref123 = new ActionReference();
        var idChnl = charIDToTypeID("Chnl");
        var idfsel = charIDToTypeID("fsel");
        ref123.putProperty(idChnl, idfsel);
        desc263.putReference(idnull, ref123);
        var idT = charIDToTypeID("T   ");
        var desc264 = new ActionDescriptor();
        var idHrzn = charIDToTypeID("Hrzn");
        var idRlt = charIDToTypeID("#Rlt");
        desc264.putUnitDouble(idHrzn, idRlt, pathInfo[i][0][0]);
        var idVrtc = charIDToTypeID("Vrtc");
        var idRlt = charIDToTypeID("#Rlt");

        desc264.putUnitDouble(idVrtc, idRlt, pathInfo[i][0][1]);
        var idPnt = charIDToTypeID("Pnt ");
        desc263.putObject(idT, idPnt, desc264);
        var idTlrn = charIDToTypeID("Tlrn");
        desc263.putInteger(idTlrn, 1);
        executeAction(idsetd, desc263, DialogModes.NO);

        var idslct = charIDToTypeID("slct");
        var desc346 = new ActionDescriptor();
        var idnull = charIDToTypeID("null");
        var ref205 = new ActionReference();
        var idChnl = charIDToTypeID("Chnl");
        var idChnl = charIDToTypeID("Chnl");
        var idRGB = charIDToTypeID("RGB ");
        ref205.putEnumerated(idChnl, idChnl, idRGB);
        desc346.putReference(idnull, ref205);
        var idMkVs = charIDToTypeID("MkVs");
        desc346.putBoolean(idMkVs, false);
        executeAction(idslct, desc346, DialogModes.NO);




        try {
            // =======================================================
            var idCpTL = charIDToTypeID("CpTL");
            executeAction(idCpTL, undefined, DialogModes.NO);

            try {
                var idrasterizeLayer = stringIDToTypeID("rasterizeLayer");
                var desc924 = new ActionDescriptor();
                var idnull = charIDToTypeID("null");
                var ref721 = new ActionReference();
                var idLyr = charIDToTypeID("Lyr ");
                var idOrdn = charIDToTypeID("Ordn");
                var idTrgt = charIDToTypeID("Trgt");
                ref721.putEnumerated(idLyr, idOrdn, idTrgt);
                desc924.putReference(idnull, ref721);
                var idWhat = charIDToTypeID("What");
                var idrasterizeItem = stringIDToTypeID("rasterizeItem");
                var idvectorMask = stringIDToTypeID("vectorMask");
                desc924.putEnumerated(idWhat, idrasterizeItem, idvectorMask);
                executeAction(idrasterizeLayer, desc924, DialogModes.NO);
            } catch (err) {}

            try {
                var idIntr = charIDToTypeID("Intr");
                var desc864 = new ActionDescriptor();
                var idnull = charIDToTypeID("null");
                var ref658 = new ActionReference();
                var idChnl = charIDToTypeID("Chnl");
                var idOrdn = charIDToTypeID("Ordn");
                var idTrgt = charIDToTypeID("Trgt");
                ref658.putEnumerated(idChnl, idOrdn, idTrgt);
                desc864.putReference(idnull, ref658);
                var idWith = charIDToTypeID("With");
                var ref659 = new ActionReference();
                var idChnl = charIDToTypeID("Chnl");
                var idfsel = charIDToTypeID("fsel");
                ref659.putProperty(idChnl, idfsel);
                desc864.putReference(idWith, ref659);
                executeAction(idIntr, desc864, DialogModes.NO);

                // =======================================================
                var idDlt = charIDToTypeID("Dlt ");
                var desc865 = new ActionDescriptor();
                var idnull = charIDToTypeID("null");
                var ref660 = new ActionReference();
                var idChnl = charIDToTypeID("Chnl");
                var idOrdn = charIDToTypeID("Ordn");
                var idTrgt = charIDToTypeID("Trgt");
                ref660.putEnumerated(idChnl, idOrdn, idTrgt);
                desc865.putReference(idnull, ref660);
                executeAction(idDlt, desc865, DialogModes.NO);

                // =======================================================
                var idMk = charIDToTypeID("Mk  ");
                var desc866 = new ActionDescriptor();
                var idNw = charIDToTypeID("Nw  ");
                var idChnl = charIDToTypeID("Chnl");
                desc866.putClass(idNw, idChnl);
                var idAt = charIDToTypeID("At  ");
                var ref661 = new ActionReference();
                var idChnl = charIDToTypeID("Chnl");
                var idChnl = charIDToTypeID("Chnl");
                var idMsk = charIDToTypeID("Msk ");
                ref661.putEnumerated(idChnl, idChnl, idMsk);
                desc866.putReference(idAt, ref661);
                var idUsng = charIDToTypeID("Usng");
                var idUsrM = charIDToTypeID("UsrM");
                var idRvlS = charIDToTypeID("RvlS");
                desc866.putEnumerated(idUsng, idUsrM, idRvlS);
                executeAction(idMk, desc866, DialogModes.NO);

            } catch (err) {}
            
            var finalSuffix=suffix;
            if (addCount===true)finalSuffix += layerCount;


            activeDocument.activeLayer.name = layerName + finalSuffix;
            layerCount++;
            
            
            activeDocument.activeLayer=baseLayer;
        } catch (e) {}
    }
    var idsetd = charIDToTypeID("setd");
    var desc1045 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref578 = new ActionReference();
    var idChnl = charIDToTypeID("Chnl");
    var idfsel = charIDToTypeID("fsel");
    ref578.putProperty(idChnl, idfsel);
    desc1045.putReference(idnull, ref578);
    var idT = charIDToTypeID("T   ");
    var idOrdn = charIDToTypeID("Ordn");
    var idNone = charIDToTypeID("None");
    desc1045.putEnumerated(idT, idOrdn, idNone);
    executeAction(idsetd, desc1045, DialogModes.NO);

    // =======================================================
    var idDlt = charIDToTypeID("Dlt ");
    var desc694 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref323 = new ActionReference();
    var idChnl = charIDToTypeID("Chnl");
    ref323.putName(idChnl, "ContiguityMask");
    desc694.putReference(idnull, ref323);
    executeAction(idDlt, desc694, DialogModes.NO);

    
    activeDocument.activeLayer.remove();
    


    var idHd = charIDToTypeID("Hd  ");
    var desc736 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var list22 = new ActionList();
    var ref541 = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref541.putEnumerated(idLyr, idOrdn, idTrgt);
    list22.putReference(ref541);
    desc736.putList(idnull, list22);
    executeAction(idHd, desc736, DialogModes.NO);

}

//   pfaffenbichler and xbytor    //
//        at ps-scripts.com       //
//      created this function     //
function collectPathInfoFromDesc(myDocument, thePath) {
    var myDocument = app.activeDocument;

    // based of functions from xbytor’s stdlib;
    var ref = new ActionReference();
    for (var l = 0; l < myDocument.pathItems.length; l++) {
        var thisPath = myDocument.pathItems[l];
        if (thisPath == thePath && thisPath.name == "Work Path") {
            ref.putProperty(cTID("Path"), cTID("WrPt"));
        };
        if (thisPath == thePath && thisPath.name != "Work Path" && thisPath.kind != PathKind.VECTORMASK) {
            ref.putIndex(cTID("Path"), l + 1);
        };
        if (thisPath == thePath && thisPath.kind == PathKind.VECTORMASK) {
            var idPath = charIDToTypeID("Path");
            var idPath = charIDToTypeID("Path");
            var idvectorMask = stringIDToTypeID("vectorMask");
            ref.putEnumerated(idPath, idPath, idvectorMask);
        };
    };
    var desc = app.executeActionGet(ref);
    var pname = desc.getString(cTID('PthN'));
    // create new array;
    var theArray = new Array;
    var pathComponents = desc.getObjectValue(cTID("PthC")).getList(sTID('pathComponents'));
    // for subpathitems;
    for (var m = 0; m < pathComponents.count; m++) {
        var listKey = pathComponents.getObjectValue(m).getList(sTID("subpathListKey"));
        // for subpathitem’s count;
        for (var n = 0; n < listKey.count; n++) {
            var points = listKey.getObjectValue(n).getList(sTID('points'));
            // get first point;
            var anchorObj = points.getObjectValue(0).getObjectValue(sTID("anchor"));
            var anchor = [anchorObj.getUnitDoubleValue(sTID('horizontal')), anchorObj.getUnitDoubleValue(sTID('vertical'))];
            var thisPoint = [anchor];
            theArray.push(thisPoint);
        };
    };
    // by xbytor, thanks to him;


    function cTID(s) {
        return cTID[s] || cTID[s] = app.charIDToTypeID(s);
    };

    function sTID(s) {
        return sTID[s] || sTID[s] = app.stringIDToTypeID(s);
    };
    // reset;
    return theArray;
};


function makePreviewSelection(){
    makeSelection()    
    app.refresh()
    activeDocument.quickMaskMode = false;
}

function makeSelection(){
    try{
    
        var idsetd = charIDToTypeID("setd");
        var desc922 = new ActionDescriptor();
        var idnull = charIDToTypeID("null");
        var ref529 = new ActionReference();
        var idChnl = charIDToTypeID("Chnl");
        var idfsel = charIDToTypeID("fsel");
        ref529.putProperty(idChnl, idfsel);
        desc922.putReference(idnull, ref529);
        var idT = charIDToTypeID("T   ");
        var ref530 = new ActionReference();
        var idChnl = charIDToTypeID("Chnl");
        var idChnl = charIDToTypeID("Chnl");
        var idTrsp = charIDToTypeID("Trsp");
        ref530.putEnumerated(idChnl, idChnl, idTrsp);
        desc922.putReference(idT, ref530);
        executeAction(idsetd, desc922, DialogModes.NO);

    } catch (err) {
        return false;
    }


    try {
        var idIntr = charIDToTypeID("Intr");
        var desc846 = new ActionDescriptor();
        var idnull = charIDToTypeID("null");
        var ref639 = new ActionReference();
        var idChnl = charIDToTypeID("Chnl");
        var idChnl = charIDToTypeID("Chnl");
        var idMsk = charIDToTypeID("Msk ");
        ref639.putEnumerated(idChnl, idChnl, idMsk);
        desc846.putReference(idnull, ref639);
        var idWith = charIDToTypeID("With");
        var ref640 = new ActionReference();
        var idChnl = charIDToTypeID("Chnl");
        var idfsel = charIDToTypeID("fsel");
        ref640.putProperty(idChnl, idfsel);
        desc846.putReference(idWith, ref640);
        executeAction(idIntr, desc846, DialogModes.NO);


    } catch (err) {}

    try {
        // =======================================================
        var idIntW = charIDToTypeID("IntW");
        var desc787 = new ActionDescriptor();
        var idnull = charIDToTypeID("null");
        var ref572 = new ActionReference();
        var idChnl = charIDToTypeID("Chnl");
        var idfsel = charIDToTypeID("fsel");
        ref572.putProperty(idChnl, idfsel);
        desc787.putReference(idnull, ref572);
        var idT = charIDToTypeID("T   ");
        var ref573 = new ActionReference();
        var idPath = charIDToTypeID("Path");
        var idPath = charIDToTypeID("Path");
        var idvectorMask = stringIDToTypeID("vectorMask");
        ref573.putEnumerated(idPath, idPath, idvectorMask);
        var idLyr = charIDToTypeID("Lyr ");
        var idOrdn = charIDToTypeID("Ordn");
        var idTrgt = charIDToTypeID("Trgt");
        ref573.putEnumerated(idLyr, idOrdn, idTrgt);
        desc787.putReference(idT, ref573);
        var idVrsn = charIDToTypeID("Vrsn");
        desc787.putInteger(idVrsn, 1);
        var idvectorMaskParams = stringIDToTypeID("vectorMaskParams");
        desc787.putBoolean(idvectorMaskParams, true);
        executeAction(idIntW, desc787, DialogModes.NO);
    } catch (err) {}



    if (tolerance >= 2) {

        activeDocument.selection.expand(Math.floor(tolerance / 2))

    }


    activeDocument.quickMaskMode = true;


    var idThrs = charIDToTypeID("Thrs");
    var desc479 = new ActionDescriptor();
    var idLvl = charIDToTypeID("Lvl ");
    desc479.putInteger(idLvl, 1);
    executeAction(idThrs, desc479, DialogModes.NO);



    if (tolerance % 2 == 1) {

        var idMtnB = charIDToTypeID("MtnB");
        var desc213 = new ActionDescriptor();
        var idAngl = charIDToTypeID("Angl");
        desc213.putInteger(idAngl, 0);
        var idDstn = charIDToTypeID("Dstn");
        var idPxl = charIDToTypeID("#Pxl");
        desc213.putUnitDouble(idDstn, idPxl, 1.000000);
        executeAction(idMtnB, desc213, DialogModes.NO);

        // =======================================================
        var idMtnB = charIDToTypeID("MtnB");
        var desc214 = new ActionDescriptor();
        var idAngl = charIDToTypeID("Angl");
        desc214.putInteger(idAngl, 90);
        var idDstn = charIDToTypeID("Dstn");
        var idPxl = charIDToTypeID("#Pxl");
        desc214.putUnitDouble(idDstn, idPxl, 1.000000);
        executeAction(idMtnB, desc214, DialogModes.NO);


        // =======================================================
        var idThrs = charIDToTypeID("Thrs");
        var desc215 = new ActionDescriptor();
        var idLvl = charIDToTypeID("Lvl ");
        desc215.putInteger(idLvl, 1);
        executeAction(idThrs, desc215, DialogModes.NO);
    }
}   

function createDialog(){
        
    var dlg = new Window('dialog', 'Layer Splitter');
    dlg.alignChildren ='left';

    dlg.gap = dlg.add('group')
    dlg.gap.orientation= 'row';
    dlg.gap.txt=dlg.gap.add('statictext', undefined,'Split when gap is larger than');
    dlg.gap.input=dlg.gap.add('edittext', undefined,tolerance);
        dlg.gap.input.preferredSize = [20,20];
    dlg.gap.txt2=dlg.gap.add('statictext', undefined,'pixels');
    dlg.gap.btnPreview= dlg.gap.add('button', undefined,'Preview');
        dlg.gap.btnPreview.preferredSize = [55,20]
    
    dlg.naming = dlg.add('panel',undefined,'Layer Naming') 
    dlg.naming.alignChildren ='left';
        dlg.naming.suffix = dlg.naming.add('group')
        dlg.naming.suffix.orientation= 'row';
        dlg.naming.suffix.txt=dlg.naming.suffix.add('statictext', undefined,'Suffix:');
        dlg.naming.suffix.input=dlg.naming.suffix.add('edittext', undefined,suffix);
            dlg.naming.suffix.input.preferredSize = [60,20];

        dlg.naming.suffix.chkbox = dlg.naming.suffix.add('checkbox', undefined, 'Add Numeral')
            dlg.naming.suffix.chkbox.value=addCount;
        
        dlg.naming.txtPreview = dlg.naming.add('statictext', undefined, layerNamePreview)
            dlg.naming.txtPreview.preferredSize = [200,20];
        
    dlg.btnPnl= dlg.add('group');
    dlg.btnPnl.alignment ='right';
    dlg.btnPnl.okBtn = dlg.btnPnl.add('button', undefined, 'OK', {name:'ok'});
        dlg.btnPnl.okBtn.active=true;
    dlg.btnPnl.cancelBtn = dlg.btnPnl.add('button', undefined, 'Cancel', {name:'cancel'});
      
    dlg.naming.suffix.input.onChanging= function(){
        layerNamePreview=activeDocument.activeLayer.name + dlg.naming.suffix.input.text
        if (dlg.naming.suffix.chkbox.value === true){
            layerNamePreview += "1"
        }
        dlg.naming.txtPreview.text =layerNamePreview
    }
    dlg.naming.suffix.chkbox.onClick = function(){
        layerNamePreview=activeDocument.activeLayer.name + dlg.naming.suffix.input.text
        if (dlg.naming.suffix.chkbox.value === true){
            layerNamePreview += "1"
        }
        dlg.naming.txtPreview.text = layerNamePreview;
    }

    
        
    
    dlg.gap.input.onChanging = function() {
        if (parseInt(dlg.gap.input.text) == 1){
            dlg.gap.txt2.text = 'pixel'
        }else{
            dlg.gap.txt2.text = 'pixels'
        }
        tolerance = parseInt (dlg.gap.input.text)
    }

    dlg.gap.btnPreview.onClick = function() {
        makePreviewSelection()   
    }
    
    x=dlg.show(); 
    
    tolerance = parseInt (dlg.gap.input.text)
    suffix = dlg.naming.suffix.input.text
    addCount=dlg.naming.suffix.chkbox.value
    
    return x;
}
