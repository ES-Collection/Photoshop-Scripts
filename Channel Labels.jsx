// the color used for the text
var black = new SolidColor();
black.rgb.hexValue = '000000';
// set this to space the labels
var horizontalOffest = new UnitValue(10,'pt');
var doc = app.activeDocument;
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
textLayer.textItem.contents = 'label';// temp label string


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
    selectComponentChannel();
    newTextLayer.remove();
}
textLayer.remove();

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