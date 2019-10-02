// edit location of the file used as registration mark
var markFile = new File(app.path + "/Presets/Scripts/reg_mark.eps");
var horizontalOffest = new UnitValue(10,'pt');
var doc = app.activeDocument;
// the color used for the text
var black = new SolidColor();
black.rgb.hexValue = '000000';
var currentLayer = doc.activeLayer;
var textLayer = doc.artLayers.add();
textLayer.kind = LayerKind.TEXT;
// font requires the postscript name of the font
textLayer.font = "ArialMT-Bold";
textLayer.textItem.size = new UnitValue(15,'pt');
textLayer.textItem.fauxBold = true;
textLayer.textItem.justification = Justification.RIGHT;
textLayer.textItem.capitalization = TextCase.ALLCAPS;
// set the position for the text. this sets to top right corner of the channel
// here it is set so the text baseline ends  40pts from the right edge, 15pts down
textLayer.textItem.position = [new UnitValue(doc.width.as('pt')-30,'pt'),new UnitValue(25,'pt')];
textLayer.textItem.contents = 'L';// temp label string
makeMarksLayer();
var marksLayer = doc.activeLayer;

for(var channelIndex = 0; channelIndex<doc.channels.length; channelIndex++){
    var newTextLayer = textLayer.duplicate();
    doc.activeLayer = newTextLayer;
    newTextLayer.textItem.contents = doc.channels[channelIndex].name;
    newTextLayer.textItem.position = [new UnitValue(doc.width.as('pt')-(30+(horizontalOffest.as('pt')*channelIndex)),'pt'),new UnitValue(25,'pt')];
    loadActiveLayerTransparencyToSelection();
    doc.activeLayer = currentLayer;
    doc.activeChannels = [doc.channels[channelIndex]];
    doc.selection.fill(black);
    doc.selection.deselect();
    doc.activeLayer = marksLayer;
    loadActiveLayerTransparencyToSelection();
    doc.activeLayer = currentLayer;
    doc.activeChannels = [doc.channels[channelIndex]];
    doc.selection.fill(black);
    doc.selection.deselect();
    selectComponentChannel();
    newTextLayer.remove();
}
textLayer.remove();
marksLayer.remove();

function loadActiveLayerTransparencyToSelection() {
    var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putProperty( charIDToTypeID('Chnl'), charIDToTypeID('fsel') );
    desc.putReference( charIDToTypeID('null'), ref );
        var ref = new ActionReference();
        ref.putEnumerated( charIDToTypeID('Chnl'), charIDToTypeID('Chnl'), charIDToTypeID('Trsp') );
    desc.putReference( charIDToTypeID('T   '), ref );
    executeAction( charIDToTypeID('setd'), desc, DialogModes.NO );
};
function selectComponentChannel() {
    try{
        var map = {}
        map[DocumentMode.GRAYSCALE] = charIDToTypeID('Blck');
        map[DocumentMode.RGB] = charIDToTypeID('RGB ');
        map[DocumentMode.CMYK] = charIDToTypeID('CMYK');
        map[DocumentMode.LAB] = charIDToTypeID('Lab ');
        var desc = new ActionDescriptor();
            var ref = new ActionReference();
            ref.putEnumerated( charIDToTypeID('Chnl'), charIDToTypeID('Chnl'), map[app.activeDocument.mode] );
        desc.putReference( charIDToTypeID('null'), ref );
        executeAction( charIDToTypeID('slct'), desc, DialogModes.NO );
    }catch(e){}
};
function makeMarksLayer(){
    var markLayer = doc.artLayers.add();
    executeAction( stringIDToTypeID( "newPlacedLayer" ), undefined, DialogModes.NO );
    executeAction( stringIDToTypeID( "placedLayerEditContents" ), new ActionDescriptor(), DialogModes.NO );
    var smartObjectDoc = app.activeDocument;
    placeEPS(markFile);
    var placedLayer = smartObjectDoc.activeLayer;
    smartObjectDoc.selection.selectAll();
    alignTopLeft();
    placedLayer.duplicate();
    alignTopCenter();
    placedLayer.duplicate();
    alignTopRight();
    placedLayer.duplicate();
    alignBottomCenter();
    smartObjectDoc.close(SaveOptions.SAVECHANGES);
};
function placeEPS(file) {
    var desc = new ActionDescriptor();
        var desc1 = new ActionDescriptor();
        desc1.putEnumerated( charIDToTypeID('fsel'), stringIDToTypeID('pdfSelection'), stringIDToTypeID('page') );
        desc1.putInteger( charIDToTypeID('PgNm'), 1 );
        desc1.putEnumerated( charIDToTypeID('Crop'), stringIDToTypeID('cropTo'), stringIDToTypeID('artBox') );
    desc.putObject( charIDToTypeID('As  '), charIDToTypeID('PDFG'), desc1 );
    desc.putPath( charIDToTypeID('null'), new File( file ) );
    desc.putEnumerated( charIDToTypeID('FTcs'), charIDToTypeID('QCSt'), charIDToTypeID('Qcsa') );
    desc.putUnitDouble( charIDToTypeID('Wdth'), charIDToTypeID('#Prc'), 100.000000 );
    desc.putUnitDouble( charIDToTypeID('Hght'), charIDToTypeID('#Prc'), 100.000000 );
    desc.putBoolean( charIDToTypeID('Lnkd'), true );
    desc.putBoolean( charIDToTypeID('AntA'), true );
    executeAction( charIDToTypeID('Plc '), desc, DialogModes.NO );
};
function align(type){
   var desc = new ActionDescriptor();
     var ref = new ActionReference();
       ref.putEnumerated( charIDToTypeID( "Lyr " ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Lnkd" ));
   desc.putReference( charIDToTypeID( "null" ), ref);
   desc.putEnumerated( charIDToTypeID( "Usng" ),charIDToTypeID( "ADSt" ), charIDToTypeID( type ) );
   executeAction( charIDToTypeID( "Algn" ), desc, DialogModes.NO );;
};
function alignCenter(){
  align("AdCH");
  align("AdCV");
};
function alignTopLeft(){
  align("AdTp");
  align("AdLf");
};
function alignTopCenter(){
  align("AdTp");
  align("AdCH");
};
function alignTopRight(){
  align("AdTp");
  align("AdRg");
};
function alignBottomCenter(){
  align("AdBt");
  align("AdCH");
};
