mergeAllSpotChannelsToNewDocument();
function mergeAllSpotChannelsToNewDocument(){
    var doc = app.activeDocument;
    var dupeDoc = doc.duplicate();
    var spotChannels = [];
    for(var channelIndex = 0; channelIndex<dupeDoc.channels.length;channelIndex++){
        if(dupeDoc.channels[channelIndex].kind == ChannelType.SPOTCOLOR){
            spotChannels.push(dupeDoc.channels[channelIndex]);
        }
    }
    dupeDoc.activeChannels = spotChannels;
    executeAction( charIDToTypeID('MSpt'), undefined, DialogModes.NO );
};
